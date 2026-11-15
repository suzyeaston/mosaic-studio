#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
if [[ ! -f index.html && -f mosaic-studio/index.html ]]; then cd mosaic-studio; fi
if [[ ! -f index.html ]]; then
  echo "MOSAIC files not found. Extract mosaic-studio.zip into Downloads first."
  read -r -p "Press Return to close..." _
  exit 1
fi
if ! command -v python3 >/dev/null 2>&1; then
  echo "Python 3 is needed to run the secure localhost web server. Install from python.org or Homebrew."
  read -r -p "Press Return to close..." _
  exit 1
fi
PORT=4173
URL="http://127.0.0.1:$PORT"
echo ""
echo "    ✳ MOSAIC / multitrack video studio"
echo "    $URL"
echo "    No uploads. Camera and mic are accessed in your browser."
echo "    Press Control-C to stop the server."
echo ""
# Open browser after server starts; avoid installing any package.
(sleep 1; open "$URL") &
exec python3 -m http.server "$PORT" --bind 127.0.0.1
