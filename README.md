# MOSAIC ✳

**Free, local-first multitrack video recording for musicians.**

An independent browser music tool by Suzy Easton, designed to complement the [audio Loop Lab](https://www.suzyeaston.ca/loop-lab/). Inspired by the *idea* of multiframe performance recording, not affiliated with Mixcord or Acapella.

## What's in v0.1

- Pick a 2×2 or 3×3 video grid.
- Record one tile at a time with camera and mic, or mic-only.
- Choose an optional **15-, 30-, 60-, or 120-second planning target**, or no target. Start recording after the optional four-beat count-in, then **Stop & Keep Take whenever you choose**. No duration automatically ends recording.
- Monitor earlier takes through headphones while recording the next tile.
- Play all takes, select/replace/mute/remove a tile, and adjust tile volume.
- Export individual source takes, or composite the grid and mixed audio into a single video file where supported.
- Retain clips locally in IndexedDB on the **same browser and device** when storage is available.
- Zero accounts, ad SDKs, analytics, tracking, paid APIs, server-side uploads, or runtime dependencies.

## Quick start on macOS

1. Unzip the download to `~/Downloads/mosaic-studio`.
2. Double-click `Launch-Mosaic.command` inside the extracted folder, or from Terminal:

   ```sh
   chmod +x ~/Downloads/mosaic-studio/Launch-Mosaic.command
   ~/Downloads/mosaic-studio/Launch-Mosaic.command
   ```

3. It launches `http://127.0.0.1:4173`, a local secure-context origin suitable for browser camera/mic permission prompts. **Nothing is sent to the Python server except the static HTML/CSS/JS file requests.** It does not accept clip uploads.
4. Use headphones, choose a blank tile, click **Record this tile**, and grant device permissions. Select another tile for an overdub. Stop the server with Control-C.

For a standard cross-platform dev server: `python3 -m http.server 4173 --bind 127.0.0.1`, then open the same URL. Tests: `node --test tests/*.test.js`.

## Create the requested new GitHub repository

Double-click `Publish-Mosaic.command` in the extracted folder, or run:

```sh
chmod +x ~/Downloads/mosaic-studio/Publish-Mosaic.command
~/Downloads/mosaic-studio/Publish-Mosaic.command
```

This uses the [GitHub CLI](https://cli.github.com/), prompts you to authenticate if needed, checks that you are logged in as `suzyeaston`, creates `suzyeaston/mosaic-studio` as a public repo, commits/pushes the project, and tries to enable free GitHub Pages publishing. If you don't have `gh`, use `brew install gh`. If Git isn't configured for commits, set your name and email using `git config` and run again.

Expected Pages URL after publication: `https://suzyeaston.github.io/mosaic-studio/`.

**The repo and Pages site do not exist merely because you downloaded this ZIP.** You must run the publish script successfully. The app requires HTTPS on its public URL.

## WordPress site integration

Preferred final URL: `https://www.suzyeaston.ca/mosaic/`.

Once GitHub Pages is live, we can add a WordPress page at `/mosaic/` with a fullscreen iframe and an **Open MOSAIC in a new tab** fallback. See [wordpress-integration.md](wordpress-integration.md) for an example, camera permissions, and tradeoffs. A direct same-origin deployment is preferable if Safari or iframe permissions misbehave. Do not merge a page pointing at a nonexistent Pages URL.

The current WordPress theme deploy has an explicit manifest; all new theme files must be added to `scripts/theme_deploy_manifest.py` in `suzyeaston/suzyeastonca`, and the WordPress page slug must actually exist in the database.

## Browser & audio limitations

- **Prefer current desktop Chrome or Edge for initial QA.** Web APIs and codecs differ in Safari and Firefox.
- Overdub/video alignment is best-effort, not sample-accurate DAW synchronization. Loop boundaries and camera encoding can introduce drift. A real-device latency pass is required before calling this production-ready.
- The longest **actual** recorded take determines the playback/export session length. Shorter takes loop within that timeline; the selected target is only a visual guide, and recording does not auto-stop. A short codec tail or asynchronous browser decode may cause drift, so test with real instruments and headphones.
- Composite export runs in **real time**, requiring the tab to remain visible; no server-side video transcoding or guaranteed MP4 output. Browser-selected `.webm` or `.mp4` is downloaded. Use individual-tile export if composite export is unsupported.
- Recording directly from speakers risks feedback. **Use headphones.**
- IndexedDB is local and subject to storage limits, private-mode restrictions, and browser deletion. This is not cloud backup; download originals.
- Public visitors grant camera/mic permissions themselves. No collaboration links, public media hosting, cloud profiles, remix permission flows, or sharing accounts exist in v0.1.
- **Only record audio/video you own or have permission to use.** No uploaded work is published by the app.

## QA checklist

- [ ] Chrome macOS: record first camera + mic take for 7s against a 15s guide, then record a separate audio-only take past that guide and stop manually; export should use the longer actual take.
- [ ] Safari macOS: grant permissions, video/audio playback, recorder MIME, composite export.
- [ ] Monitor two takes with headphones and check onset drift / first beat and loop boundary.
- [ ] 2×2 and 3×3 layout, grid downgrade protection when tile 5+ is filled.
- [ ] Mute/volume controls, replace, remove, clear with destructive confirmation.
- [ ] Local storage persists after reload; browser privacy mode reports non-persistence.
- [ ] Export video has audible sound and valid playback in QuickTime/VLC.
- [ ] Mobile iOS/Android: permissions, video fit, file download behavior.
- [ ] Open as WordPress iframe with allow=camera;microphone, verify at deployed origin.

## Roadmap

1. **Timing engine:** AudioWorklet transport, compensated latency, metronome over the monitored timeline, manual offset correction.
2. **Editing:** trim/crop, mix EQ/pan, track names, source video import, visual countdown/preview.
3. **Projects:** import/export an offline project bundle (without mandatory accounts).
4. **Collaboration with consent:** opt-in shareable project handoff, attribution, remix permission, moderation and storage policy before any server feature.
5. **Accessibility:** keyboard bindings, visual metronome, caption support, expanded controls.

## Privacy & licence

Everything runs in the visitor's browser. The Python launcher serves static files only; GitHub Pages also serves static files only. MIT licensed. See LICENSE.
