# Blisspoint

## Documentation

- [Blisspoint on GitHub](https://github.com/heatpunk/blisspoint#readme) — the
  project's own README: features, the API the UI talks to, and development notes.
- [asic-rs](https://github.com/256foundation/asic-rs) — the 256 Foundation
  library Blisspoint uses to speak to miners, and the source of truth for which
  models and firmwares are supported.

## What you get on StartOS

A single web interface, meant for a phone. It shows one miner at a time with its
hashrate, power draw, chip temperature and fan speed, refreshed every few
seconds, and gives you one slider for heat and one button for pause/resume.

Your miner list and settings are saved on your server, so they are included in
your StartOS backups and are there whichever phone or browser you open
Blisspoint from.

## Getting set up

Your server and your miners must be on the same local network; Blisspoint
reaches the miners directly.

1. Open the **Web UI** — ideally on a phone or tablet connected to that same
   network, since that is what the layout is designed for.
2. Open the miner menu at the bottom and tap **Scan LAN**. If nothing is found,
   add the miner's IP address by hand in **Settings** — a scan with no miners
   configured yet only sweeps `192.168.1.x`, so on any other network you need to
   add the first miner manually.
3. Tap the miner to select it. Its live readings appear at the top.

On the first successful connection Blisspoint reads the miner's own power target
and locks that in as the maximum the slider will ever allow. This is deliberate:
nobody in the house can drive the machine harder than you set it up for.

## Using Blisspoint

### Setting the heat

Drag the power slider and release. More power means more heat. The slider runs
from the miner's minimum up to the ceiling captured on first connect.

To raise that ceiling you have to change the power target in the miner's own
interface, then remove and re-add the miner here. There is no way to raise it
from Blisspoint.

### Pausing

The pause/resume button stops and restarts mining. Some firmwares ask for the
miner's own API password the first time — the username is `root`. The password
is saved in your browser so you are not asked again on that device.

### Adding more miners

Repeat the scan or add further IP addresses in **Settings**. The menu at the
bottom switches between them.

## Limitations

- **Your miner passwords are kept in your backups.** Any miner password you
  enter is saved on the server as ordinary text so it survives restarts, which
  means it is also inside every backup of Blisspoint. Keep those backups
  somewhere you trust.
- **Two people editing at once will overwrite each other.** If you change
  settings on two phones at the same moment, whichever saves last wins.
- **Control depends on the firmware.** Live monitoring works across a wide range
  of miners. Setting a power target and pausing only work where the firmware
  supports it — check the asic-rs link above if a button does nothing.
