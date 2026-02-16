#!/usr/bin/env bash
set -euo pipefail

# Script to download external Unsplash images used by the HTML files
# and place them in ./img/, then update HTML files to reference local images.

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
IMG_DIR="$BASE_DIR/img"
HTML_FILES=(index.html en/index.html)

mkdir -p "$IMG_DIR"

 # List of remote URLs and corresponding local filenames (POSIX / macOS bash compatible)
URLS=(
  "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80"
  "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80"
  "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80"
  "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80"
  "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&q=80"
)
IMG_FILES=(
  "unsplash-1.jpg"
  "unsplash-2.jpg"
  "unsplash-3.jpg"
  "unsplash-4.jpg"
  "unsplash-5.jpg"
)

echo "Downloading ${#URLS[@]} images to $IMG_DIR"
for i in $(seq 0 $((${#URLS[@]} - 1))); do
  url=${URLS[$i]}
  filename=${IMG_FILES[$i]}
  dest="$IMG_DIR/$filename"
  if [ -f "$dest" ]; then
    echo "- Skipping existing $filename"
    continue
  fi
  echo "- Downloading $url -> $filename"
  curl -L "$url" -o "$dest"
done

# Update HTML files to reference local images
for f in "${HTML_FILES[@]}"; do
  ff="$BASE_DIR/$f"
  if [ ! -f "$ff" ]; then
    echo "Warning: $ff not found"
    continue
  fi
  tmp="${ff}.tmp"
  cp "$ff" "$tmp"
  for i in $(seq 0 $((${#URLS[@]} - 1))); do
    url=${URLS[$i]}
    filename=${IMG_FILES[$i]}
    # Use Perl for in-place cross-platform replacement
    perl -pe "s#\Q${url}\E#img/${filename}#g" "$tmp" > "${tmp}.2"
    mv "${tmp}.2" "$tmp"
  done
  mv "$tmp" "$ff"
  echo "Updated $f"
done

echo "Done. Commit the new images and HTML changes to include self-hosted images." 
