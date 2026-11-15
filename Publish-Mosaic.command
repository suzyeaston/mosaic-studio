#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
if [[ ! -f index.html && -f mosaic-studio/index.html ]]; then cd mosaic-studio; fi
if [[ ! -f index.html ]]; then echo "Extract mosaic-studio.zip first."; exit 1; fi
if ! command -v git >/dev/null 2>&1; then echo "Git is required. Run: xcode-select --install"; exit 1; fi
if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required to create the repository."
  echo "Install with: brew install gh"
  echo "Then run this script again."
  exit 1
fi
if ! gh auth status >/dev/null 2>&1; then
  echo "Let's authenticate with GitHub in the browser."
  gh auth login --hostname github.com --git-protocol https --web
fi
SIGNED_IN="$(gh api user --jq '.login')"
OWNER=suzyeaston
REPO=mosaic-studio
if [[ "$SIGNED_IN" != "$OWNER" ]]; then
  echo "You are logged in as $SIGNED_IN, but this script expects GitHub account $OWNER."
  echo "Switch with: gh auth switch --hostname github.com --user $OWNER"
  exit 1
fi
if [[ ! -d .git ]]; then git init -b main; fi
git add -A
if ! git diff --cached --quiet; then
  git commit -m "Build MOSAIC local-first multitrack studio" || {
    echo "Set git commit identity using git config user.name and git config user.email, then rerun."
    exit 1
  }
fi
if gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
  echo "Repository already exists. Pushing your local files."
  if ! git remote get-url origin >/dev/null 2>&1; then git remote add origin "https://github.com/$OWNER/$REPO.git"; fi
  git push -u origin main
else
  echo "This creates a PUBLIC GitHub repository at https://github.com/$OWNER/$REPO"
  gh repo create "$OWNER/$REPO" --public --source=. --remote=origin --push --description "MOSAIC: free, local-first multitrack video studio"
fi
# Pages hosts this completely static client-side app; no service or upload backend.
if ! gh api "repos/$OWNER/$REPO/pages" >/dev/null 2>&1; then
  if gh api -X POST "repos/$OWNER/$REPO/pages" -f 'source[branch]=main' -f 'source[path]=/' >/dev/null; then
    echo "GitHub Pages configured. Publishing can take a few minutes."
  else
    echo "GitHub Pages could not be enabled automatically. In the repo use Settings > Pages > Deploy from branch main / root."
  fi
fi
URL="https://$OWNER.github.io/$REPO/"
echo ""
echo "MOSAIC repository: https://github.com/$OWNER/$REPO"
echo "Expected live preview: $URL"
open "https://github.com/$OWNER/$REPO" || true
read -r -p "Press Return to close..." _
