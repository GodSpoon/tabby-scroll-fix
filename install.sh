#!/bin/bash
set -e

# Detect OS and set plugin directory
case "$(uname -s)" in
  Darwin*)
    PLUGIN_DIR="$HOME/Library/Application Support/tabby/plugins"
    ;;
  Linux*)
    PLUGIN_DIR="$HOME/.config/tabby/plugins"
    ;;
  MINGW*|CYGWIN*|MSYS*)
    PLUGIN_DIR="$APPDATA/tabby/plugins"
    ;;
  *)
    echo "Unsupported OS: $(uname -s)"
    exit 1
    ;;
esac

# Resolve source path (supports ~ and relative paths)
SOURCE_PATH="$(cd "$(dirname "$0")" && pwd)"

echo "Detected OS: $(uname -s)"
echo "Plugin directory: $PLUGIN_DIR"
echo "Source path: $SOURCE_PATH"
echo ""

# Check source exists
if [ ! -d "$SOURCE_PATH" ]; then
  echo "Error: Source path does not exist: $SOURCE_PATH"
  exit 1
fi

# Ensure plugin directory exists
mkdir -p "$PLUGIN_DIR"

# Build the plugin if dist doesn't exist
if [ ! -d "$SOURCE_PATH/dist" ]; then
  echo "Building plugin..."
  cd "$SOURCE_PATH"
  npm install --legacy-peer-deps
  npx webpack
  echo ""
fi

# Install into Tabby plugins directory
echo "Installing into $PLUGIN_DIR..."
cd "$PLUGIN_DIR"

# Windows: use tarball to avoid symlink issues
case "$(uname -s)" in
  MINGW*|CYGWIN*|MSYS*)
    TARBALL="$SOURCE_PATH/tabby-scroll-fix.tgz"
    echo "Packaging tarball for Windows..."
    cd "$SOURCE_PATH"
    npm pack --silent
    mv tabby-scroll-fix-*.tgz "$TARBALL" 2>/dev/null || mv tabby-scroll-fix.tgz "$TARBALL" 2>/dev/null || true
    cd "$PLUGIN_DIR"
    npm install "$TARBALL" --legacy-peer-deps
    rm -f "$TARBALL"
    ;;
  *)
    npm install "$SOURCE_PATH" --legacy-peer-deps
    ;;
esac

echo ""
echo "Done! Restart Tabby, then enable the plugin under Settings > Plugins."
