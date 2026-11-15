# MOSAIC → suzyeaston.ca integration plan

Do not merge the WordPress integration until `https://suzyeaston.github.io/mosaic-studio/` is working, including mic/camera permissions at the top-level origin.

Create a real WordPress Page with slug `mosaic` and select a dedicated theme template.
An example template (not yet deployed) would use the standard site header/footer and:

```php
<main id="primary" style="max-width:1440px;margin:auto;padding:1rem">
  <h1>MOSAIC / multitrack video studio</h1>
  <p>Free. Local-first. Your recordings stay on your device.</p>
  <p><a href="https://suzyeaston.github.io/mosaic-studio/" target="_blank" rel="noopener noreferrer">Open MOSAIC in its own tab</a> (recommended for camera/mic reliability)</p>
  <iframe title="MOSAIC multitrack video studio"
    src="https://suzyeaston.github.io/mosaic-studio/"
    allow="camera; microphone; autoplay"
    referrerpolicy="no-referrer"
    style="border:0;width:100%;min-height:1150px;display:block;"
  ></iframe>
</main>
```

**Important:** cross-origin camera/microphone access can be restricted by the parent's `Permissions-Policy` HTTP response header or browser rules even when iframe `allow` is set. For a robust v1, a direct link to the standalone Pages app is the fallback. A later same-origin copy of the static files under the WordPress theme (or same-origin reverse proxy) avoids this class of iframe limitations.

For `suzyeaston/suzyeastonca`: add the new PHP template and any local assets to the explicit deployment manifest, run `python3 scripts/theme_deploy_manifest.py validate` and normal CI, then QA a private WordPress page before public linking from Loop Lab / Projects / homepage.
