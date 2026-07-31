<p align="center">
  <img src="icon.png" alt="Blisspoint Logo" width="21%" />
</p>

# Blisspoint on StartOS

> **Upstream docs:** <https://github.com/heatpunk/blisspoint#readme>
>
> The application is developed at [heatpunk/blisspoint]; this repository is the
> StartOS packaging fork of it. Anything not described in this document behaves
> exactly as the upstream README and the app itself describe.

[heatpunk/blisspoint]: https://github.com/heatpunk/blisspoint

Blisspoint is a deliberately simple UI for running a bitcoin ASIC miner as a
space heater: one slider for heat output, a live readout, and a pause button.
It is built for the people you share a home with rather than for the person who
set the miner up. This document covers what the StartOS package adds and how it
is wired.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions](#actions)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| What          | Detail                                                                                       |
| ------------- | -------------------------------------------------------------------------------------------- |
| Image source  | `ghcr.io/heatpunk/blisspoint`, published by upstream from the `Dockerfile` in this tree |
| Architectures | `x86_64`, `aarch64`                                                                          |
| Entrypoint    | The image's own `CMD`, via `sdk.useEntrypoint()`                                             |

The `Dockerfile` builds in three stages: `proxy-rs` as a static musl binary
(`rust:alpine`), the Vite/React UI to static assets on the build platform, and a
`node:20-alpine` runtime carrying both. The container runs two processes — the
Node server on port 80 and `proxy-rs` on loopback — from a single `sh -c`
command. `startos/main.ts` does not restate that command; it defers to the image
so the two cannot drift apart.

## Volume and Data Layout

| Volume | Mount point |
| ------ | ----------- |
| `main` | `/data`     |

The Node server persists all user state to `/data/state.json` — the miner list,
per-miner names, the captured power ceiling, saved miner API passwords, and the
theme. Writes go to a temporary file and are then renamed, so an interrupted
write cannot truncate the saved settings.

The browser keeps a `localStorage` copy under `blisspoint.state.v2` as a cache
and as a fallback when the server endpoint is unreachable, but the server copy
is authoritative: on load the UI prefers `/data/state.json` and falls back to
`localStorage` only if the request fails.

> [!IMPORTANT]
> Miner API passwords are stored in `/data/state.json` in plaintext, and are
> therefore included in backups. See
> [Limitations](#limitations-and-differences).

## Installation and First-Run Flow

There is no setup wizard, no generated credential, and no first-run task. Once
the service is started the web interface is immediately usable, and opens on an
empty miner list. The user adds a miner by IP address, or runs a LAN scan from
within the UI.

The power ceiling for each miner is captured from that miner's own reported
power target the first time it connects, and then frozen. Raising it is
deliberately not possible from Blisspoint; the miner must be removed and
re-added after its target is changed in the miner's own interface.

## Configuration Management

| StartOS-Managed | Upstream-Managed                                                     |
| --------------- | --------------------------------------------------------------------- |
| Nothing         | Every setting, via the Blisspoint web interface, saved to `/data`     |

The package defines no file models, no environment variables, and no
configuration actions. `startos/fileModels/` is intentionally empty.

## Network Access and Interfaces

| Interface | ID   | Port | Protocol | Purpose                  |
| --------- | ---- | ---- | -------- | ------------------------ |
| Web UI    | `ui` | 80   | HTTP     | The entire Blisspoint UI |

The interface is bound through a `MultiHost` (`ui-multi`), so the user chooses
where it is reachable from using the normal StartOS interface controls.

Two things are **not** exposed:

- `proxy-rs` listens on `127.0.0.1:8081` inside the container only. The Node
  server reverse-proxies `/api/*` to it; nothing else can reach it.
- The miner API itself is never exposed. Blisspoint talks outbound to miners.

**Outbound LAN access is required.** The container must be able to reach the
miners on the local network on their firmware's API port. This is the single
network requirement of the service, and the one thing that makes it useless if
unavailable.

## Actions

None. The package ships an empty `sdk.Actions.of()`.

## Backups and Restore

The `main` volume is included in backups via `sdk.Backups.ofVolumes('main')`,
which captures `/data/state.json` — the miner list, per-miner names, captured
power ceilings, saved miner API passwords, and the theme.

A restored install comes back with its miners already configured. Because the
saved passwords are part of that file, **a backup of this service contains
miner API credentials in plaintext**; treat it with the same care as any other
service backup.

Nothing else is stored: live readings are polled from the miners on each
refresh and are not persisted.

## Health Checks

| Daemon    | Check                          | Grace period |
| --------- | ------------------------------ | ------------ |
| `primary` | `checkPortListening` on port 80 | SDK default  |

Success message: "The web interface is ready".
Failure message: "The web interface is not ready".

The check confirms only that the UI server is accepting connections. It does not
verify that any miner is reachable — a Blisspoint install with no miners
configured is healthy.

## Dependencies

None.

## Limitations and Differences

1. **Miner API passwords are stored in plaintext on the server.** Passwords
   entered for pause/resume or power control are written to `/data/state.json`
   as given, and are consequently included in every backup of this service.
2. **Last write wins across devices.** Each browser saves the whole state
   object, so two people editing from different phones at the same time will
   have one overwrite the other's change. There is no merge or conflict
   prompt.
3. **The LAN scan guesses the subnet.** It derives the `/24` to sweep from the
   first configured miner's IP address, falling back to `192.168.1.0/24` when no
   miner is configured yet. On any other subnet, add one miner by IP address
   first; subsequent scans then target the right range.
4. **Control support is narrower than monitoring support.** Reading live stats
   works across the firmwares `asic-rs` supports; setting a power target and
   pausing/resuming only work where the firmware exposes them.
5. **No StartOS actions.** Everything is driven from the web interface.

## What Is Unchanged from Upstream

The StartOS package runs the image published by upstream — the same one the
Docker, Umbrel, and Home Assistant installs use — with no StartOS-specific
patches to the UI, the Node server, or `proxy-rs`. This fork's changes are
confined to `startos/`, the build files, and the CI workflows. Miner
communication, the power-ceiling capture rule, the theme set, and the API
surface documented in the upstream README all behave identically here.

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) in the repository root for
prerequisites, checks, and the release flow.

---

## Quick Reference for AI Consumers

```yaml
package_id: blisspoint
architectures: [x86_64, aarch64]
volumes:
  main: /data
ports:
  ui: 80
dependencies: none
startos_managed_env_vars: []
actions: []
notes:
  - user state persists to /data/state.json; browser localStorage is a cache/fallback
  - that file holds miner API passwords in plaintext and is included in backups
  - requires outbound LAN reachability to miners
  - proxy-rs is internal only, on 127.0.0.1:8081
```
