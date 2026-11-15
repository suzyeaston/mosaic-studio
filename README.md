# MOSAIC ✳

**Free, local-first multitrack video recording for musicians.**

An independent browser music tool by Suzy Easton, designed to complement the [audio Loop Lab](https://www.suzyeaston.ca/loop-lab/). Inspired by the *idea* of multiframe performance recording, not affiliated with Mixcord or Acapella.

## What's in v0.1

- Pick a 2×2 or 3×3 video grid.
- **No-scroll take controls:** tap the + on an empty tile to start its camera/count-in recording flow. Tap that tile again while recording to **Stop & Keep**. Each recorded tile has its own top-left × remove button (with confirmation), independent of selection. The sidebar recording and removal buttons still work.
- Record one tile at a time with camera and mic, or mic-only.
- Choose an optional **15-, 30-, 60-, or 120-second planning target**, or no target. Start recording after the optional four-beat count-in, then **Stop & Keep Take whenever you choose**. No duration automatically ends recording.
- Monitor earlier takes through headphones while recording the next tile.
- Play all takes, select/replace/mute/remove a tile, and adjust tile volume.
- Export individual source takes, or composite the grid and mixed audio into a single video file where supported.
- Retain clips locally in IndexedDB on the **same browser and device** when storage is available.
- Zero accounts, ad SDKs, analytics, tracking, paid APIs, server-side uploads, or runtime dependencies.

## Ready-made musical loops and beat builder (v0.5 · Stage 2a)

The SUZY//AI crossover now starts with **music that already loops**, in addition to hand-played instrument notes. The ready-made original browser-synth loop library contains three rhythms (**Harbour Pulse, Broken Machine, Half-time / Air**), plus **Sub Walk** bass, **Glass Circuit** keys and **Soft Orbit** pads. Choose 1, 2 or 4 bars and tap **Add Loop** to get a fully playable, independently mutable layer.

Open **Build Your Own Rhythm** to toggle kick, snare and hat in a 16-step 4/4 sequencer; **Add My Rhythm Loop** creates an independently repeating part. Notes and drum events are generated locally with Web Audio using SUZY//AI's scoring and synthesized drum concepts; there are **no pre-recorded loops or licensed samples**. All pattern layers persist privately in the browser and are routed into MOSAIC's usual Play All and MP4-first export.

The Set Your Tempo BPM value controls **newly created** loops. Existing loops retain their committed BPM and phase to avoid silently rewriting music; keep the tempo constant when building an arrangement to maintain sync. In this prototype, note performance and captured video stay free-running and are not automatically quantized. Pattern loops are a separate layer type and do not overwrite any live take. Audio-reactive **visualizers remain a later stage**.

## SUZY//AI crossover: playable software instruments (v0.4 · Stage 1)

MOSAIC has a lightweight **Instrument Rack** directly below the video grid. Choose **Keys**, **Bass** or **Pad** and tap the eight note buttons or computer keys **A S D F G H J K**. Press **Record Instrument Layer**, play a phrase and press **Stop & Keep Layer**. Up to twelve separate note-event layers may be muted, mixed and removed. Each layer repeats at its recorded phrase duration alongside the video takes. The browser Web Audio mix is routed into **Play All** and final MP4/WebM video export. If no camera takes exist, the exported video contains the empty square grid and the instrument audio. The stage-two visualizer will improve that picture.

This reuses the *design and synthesis ideas* from SUZY//AI's browser audio renderer and TOASTER independent looping model. The first release **does not run Magenta or generative AI**. No model weights, samples, external scripts, online accounts or server uploads. Instrument notes are saved as compact event data in browser localStorage (video takes remain in IndexedDB), subject to normal storage eviction.

These are short, triggered notes rather than a sustain-pedal piano. The scheduling uses a Web Audio lookahead behind MOSAIC's existing browser transport; it is not sample-accurate DAW synchronization. MIDI input, quantization, longer envelopes and audio-reactive visuals are future stages. This is an experimental instrument and requires listening QA.

Source attribution: see `NOTICE` and [SUZY//AI](https://github.com/suzyeaston/suzy-ai).

## Social-ready movie export (v0.3)

**Export Movie** now prefers MP4, requesting H.264 video + AAC audio first. We negotiate the actual supported `MediaRecorder` MIME type and check the encoder, falling back to WebM only when MP4 is unavailable. The downloaded file's extension matches its real MIME type; simply renaming `.webm` to `.mp4` is not a conversion. A format note appears in the export section and after download. Source takes continue using the browser's preferred capture format to avoid breaking camera/mic capture.

For YouTube and Instagram, MP4 with H.264/AAC is broadly accepted. A generic `video/mp4` recorder can still choose different codecs, so verify playback and platform upload on your actual device; the browser determines the output codecs. If MP4 recording is not supported, a local H.264/AAC conversion is required for Instagram, or retry an up-to-date browser. No third-party uploads or heavy transcoder dependencies are added.

## Visual effects and social sharing (v0.2)

Pick **Clean**, **Noir**, **Ultraviolet**, **Daydream**, or **VHS** and set effect intensity in the Visual Laboratory. Press **Play All** to preview an effected composite over the existing tile grid. The same canvas renderer runs during export so your downloaded square video includes the effect. Raw camera/mic takes stay pristine, and changing an effect or track clears the previous share-ready export rather than risking sharing a stale mix.

Export the grid first, then choose **Share Exported Video**. Where the browser supports the Web Share API for video files, MOSAIC opens the native file share sheet. Otherwise it downloads the exported video, and you can copy the editable caption and attach the video yourself to Instagram, TikTok, YouTube or another destination. **The web app cannot silently post to social accounts.** Codec/platform acceptance differs, particularly on iPhones. No media is uploaded to this site or to MOSAIC servers.

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

The production WordPress theme now vendors this app at `assets/mosaic/`, serves it from a virtual `/mosaic/` route, and deploys through the existing GitHub Actions theme pipeline. Update **both repos** for new releases; no GitHub Pages or manual WordPress dashboard page is needed. Source development remains here.

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
