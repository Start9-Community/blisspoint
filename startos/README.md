<p align="center">
  <img src="icon.png" alt="Blisspoint Logo" width="21%" />
</p>

# Blisspoint on StartOS

> Everything not listed in this document should behave the same as upstream
> Blisspoint. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[Blisspoint](https://github.com/heatpunk/blisspoint) is a deliberately simple UI for running a Bitcoin ASIC miner as a space heater: one slider for heat output, a live readout, and a pause button. It is built for the people you share a home with rather than for the person who set the miner up.

This repository is a fork of the application's own, and the StartOS packaging lives under `startos/` rather than at the repository root — see [Image and Container Runtime](#image-and-container-runtime).

- **Upstream repo:** <https://github.com/heatpunk/blisspoint>
- **Wrapper repo:** <https://github.com/Start9-Community/blisspoint>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

One image, published by upstream and consumed unmodified — pinned by digest as well as tag.

| Property      | Value                                      |
| ------------- | ------------------------------------------ |
| Image         | `ghcr.io/heatpunk/blisspoint`              |
| Architectures | x86_64, aarch64                            |
| Entrypoint    | The image's own, via `sdk.useEntrypoint()` |

| Subcontainer     | Purpose                                  |
| ---------------- | ---------------------------------------- |
| `blisspoint-sub` | The only daemon — the one to `attach` to |

**Two processes run inside that one container**: a Node server on port 80 serving the UI, and `proxy-rs` on loopback doing all miner communication. The Node server reverse-proxies `/api/*` to it. `main.ts` deliberately does not restate that command — it defers to the image's own, so the two cannot drift apart.

This repository is the application's own, forked, so the packaging is a subdirectory rather than the whole tree. That has one practical consequence worth knowing: the `Makefile` here is hand-written rather than the SDK's `s9pk.mk`, because `npm run build` in this tree is the Vite build, not the packaging bundle.

## Volume and Data Layout

One volume, holding everything the user has configured.

| Volume | Mount Point | Purpose                                          |
| ------ | ----------- | ------------------------------------------------ |
| `main` | `/data`     | The miner list, saved credentials, and the theme |

| Path               | Written by      | Holds                                                      |
| ------------------ | --------------- | ---------------------------------------------------------- |
| `/data/state.json` | The Node server | Miners, names, captured power ceilings, passwords, theme   |
| `/data/secret.key` | The Node server | The AES-256-GCM key, mode `0600`, generated on first write |

Writes go to a temporary file and are then renamed, so an interrupted write cannot truncate the saved settings.

String values in `state.json` are **encrypted at rest** as `enc:v1:<iv>:<tag>:<ciphertext>`. The key sits in the same volume, which means encryption protects the file on disk and **not** the backup — see [Backups and Restore](#backups-and-restore).

The browser keeps a copy in `localStorage` as a cache and as a fallback when the server endpoint is unreachable, but the server copy is authoritative: on load the UI prefers `/data/state.json` and falls back to `localStorage` only if the request fails.

## File Models

None. The package defines no file models, sets no environment variables, and writes nothing to the volume itself.

Every setting is the application's own, entered through its web interface and persisted by its Node server to `/data`. There is nothing on disk for StartOS to seed, merge, or repair, and nothing an action could correct — which is also why this package has no configuration action.

## Dependencies

None.

## Network Access and Interfaces

One interface, and one un-published outbound requirement that matters more than it does.

| Interface | Id   | Type | Port | Description              |
| --------- | ---- | ---- | ---- | ------------------------ |
| Web UI    | `ui` | ui   | 80   | The entire Blisspoint UI |

Bound on the `ui-multi` MultiHost over HTTP and not masked.

Two things are **not** exposed:

- **`proxy-rs` listens on loopback inside the container only.** The Node server proxies `/api/*` to it; nothing outside the container can reach it.
- **The miner's own API is never exposed.** Blisspoint talks outbound to miners; it does not front them.

**Outbound LAN access is the single network requirement.** The container must be able to reach the miners on the local network on their firmware's API port. Nothing about the StartOS interface controls affects that — a Blisspoint reachable from anywhere is still useless if it cannot reach the miners, which is the most common way this service appears broken while being perfectly healthy.

## Installation and First-Run Flow

There is no wizard, no generated credential, and no task. Once started, the web interface is immediately usable and opens on an empty miner list.

The user adds a miner by IP address or runs a LAN scan from inside the UI. **The first successful connection captures that miner's own reported power target and freezes it as the ceiling** the slider will ever allow — which is the package's whole safety model, and is deliberately not raisable from Blisspoint. Changing it means raising the target in the miner's own interface, then removing and re-adding the miner here.

## Actions

None. The package ships an empty action set; everything is driven from the web interface.

## Tasks

None. This package raises no tasks, so the service is never held on a prompt and its ordinary controls are always available.

## Health Checks

One check, on the only daemon.

| Check     | Displayed as    | Method               | Grace Period |
| --------- | --------------- | -------------------- | ------------ |
| `primary` | "Web Interface" | Port 80 is listening | default      |

**The check says nothing about miners.** It confirms the UI server is accepting connections, and a Blisspoint with no miners configured — or with miners it cannot reach — is green. That is correct, and it is also why the health check is not the place to diagnose a miner problem; the UI is.

## Backups and Restore

The `main` volume is copied wholesale — `sdk.Backups.ofVolumes('main')`. That is `state.json` and `secret.key`.

**A backup of this service is readable as miner API credentials.** The passwords in `state.json` are encrypted, but `secret.key` is in the same volume and therefore in the same backup, so anyone holding the backup holds both halves. Treat it accordingly.

A restored install comes back with its miners already configured, including their captured power ceilings. Nothing else is stored: live readings are polled from the miners on each refresh and are never persisted.

## Limitations and Differences

1. **A backup exposes miner API passwords.** The key travels with the ciphertext.
2. **Last write wins across devices.** Each browser saves the whole state object, so two people editing from different phones at once will have one overwrite the other. There is no merge and no conflict prompt.
3. **The LAN scan sweeps a fixed set of `/24`s** — the first configured miner's, the container's own, and `192.168.1`, `192.168.0`, `10.0.0` unconditionally, with Docker's `172.16/12` excluded from the derived entries. Miners on any other subnet must be added by IP address.
4. **Control support is narrower than monitoring support.** Reading live stats works across the firmwares `asic-rs` supports; setting a power target and pausing only work where the firmware exposes them.
5. **No StartOS actions and no configuration surface.** Everything is in the web interface.
6. **The power ceiling cannot be raised from Blisspoint** — by design.

---

## Quick Reference for AI Consumers

```yaml
package_id: blisspoint
image: ghcr.io/heatpunk/blisspoint # pinned by digest as well as tag
architectures:
  - x86_64
  - aarch64
subcontainers:
  - blisspoint-sub
volumes:
  main: /data # state.json and secret.key
file_models: []
startos_managed_env_vars: []
dependencies: []
interfaces:
  ui: { type: ui, port: 80 }
actions: []
tasks: []
health_checks:
  - primary # displayed "Web Interface"
```
