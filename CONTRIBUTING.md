# Contributing to Blisspoint

Thanks for taking a look! Blisspoint is a small, focused app: a friendly UI for running an ASIC miner as a heater. Issues and PRs are welcome.

## Prerequisites

- **Node.js 20+**
- **Rust** (stable) — for the `proxy-rs` service
- A miner on your LAN is *not* required for development; most of the UI works against the built-in offline state.

## Run it locally

```bash
npm install
npm run dev:full     # runs proxy-rs (cargo) and Vite together
```

Open the printed Vite URL (port `8080`). To reach a real miner, make sure your machine is on the same network and add the miner's IP in Settings.

## Checks

```bash
npm run build                                   # UI builds
npm run lint                                    # ESLint
npm test                                        # Vitest (UI utils)
cargo test  --manifest-path proxy-rs/Cargo.toml # proxy-rs tests
cargo clippy --manifest-path proxy-rs/Cargo.toml --all-targets -- -D warnings
npm run startos:check                           # StartOS packaging typecheck
```

CI runs all of these on every PR.

## Project layout

| Path | What |
|------|------|
| `src/` | React/Vite UI |
| `server/serve.cjs` | Serves the built UI and reverse-proxies `/api/*` |
| `proxy-rs/` | Rust service; all miner communication via [asic-rs](https://github.com/256foundation/asic-rs) |
| `startos/` | StartOS (Start9) packaging — see [startos/README.md](startos/README.md) |
| `umbrel/`, `blisspoint-addon/`, `custom_components/` | Umbrel and Home Assistant packaging |
| `.github/workflows/` | App CI (`ci.yml`) plus the Start9 packaging pipelines (`build.yml`, `tagAndRelease.yml`, `release.yml`) |

### Building the StartOS package locally

`make x86` (or `make arm`) typechecks `startos/`, bundles it with `ncc`, and
packs a sideloadable `blisspoint_<arch>.s9pk`. It pulls the already-published
image named in `startos/manifest/index.ts` — it never builds one.

## Firmware support

Blisspoint does not implement per-firmware protocols itself — that lives upstream in **asic-rs**. If a miner isn't detected or a control action (power/pause) isn't supported, the gap is usually in asic-rs. Mappings from asic-rs data to the API are documented in [`proxy-rs/MAPPING.md`](proxy-rs/MAPPING.md).

## Pull requests

- Keep PRs focused; one change per PR.
- Make sure the checks above pass.
- Describe what changed and how to test it. If it touches the UI, a screenshot helps.

## Releasing

Releases are cut automatically from `main`. Bump the version in `startos/versions/current.ts` and, when adopting a newer app build, the image tag in `startos/manifest/index.ts`, then open a PR. On merge, `tagAndRelease.yml` tags the commit, packs an s9pk per architecture against the published image, creates the GitHub Release, and publishes to the Start9 Community Registry. It does **not** build or push a container image — that happens in [heatpunk/blisspoint](https://github.com/heatpunk/blisspoint).

A version already present on the community registry is skipped, so a packaging-only fix needs its own `:<revision>` bump to ship.

`startos/versions/current.ts` carries a two-part version, `<upstream>:<revision>`. Bump the upstream part when adopting a new app version; bump only the revision when the change is packaging-only. The `Makefile` reads the package id from the manifest and needs no edit.

The Umbrel packaging is version-pinned too: bump `version` in `umbrel/blisspoint/umbrel-app.yml` and the image tag in `umbrel/blisspoint/docker-compose.yml`, then mirror the changes to [heatpunk/umbrel-app-store](https://github.com/heatpunk/umbrel-app-store) so the community store serves the new version.

The Home Assistant packaging pins the same release: bump `version` in `blisspoint-addon/config.yaml` (HA pulls `ghcr.io/heatpunk/blisspoint:{version}`) and in `custom_components/blisspoint/manifest.json`.
