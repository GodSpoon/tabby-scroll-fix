# tabby-scroll-fix

A [Tabby](https://tabby.sh/) terminal plugin that fixes the scroll jumping issue caused by [Claude Code](https://github.com/anthropics/claude-code).

## Problem

Claude Code sends `\x1b[3J` (clear scrollback buffer) and `\x1b[2J` (clear screen) escape sequences when re-rendering its TUI. This causes xterm.js in Tabby to jump the viewport to the top of the buffer and flash the screen on every update.

See [anthropics/claude-code#769](https://github.com/anthropics/claude-code/issues/769).

## Solution

This plugin intercepts `frontend.write()` on every terminal tab and:

1. **Strips `\x1b[3J`** — prevents viewport jumping to the top of scrollback
2. **Replaces `\x1b[2J` with `\x1b[H\x1b[J`** — clears the screen in-place (cursor home + erase below) instead of pushing content into scrollback, which eliminates the viewport jump and flicker

## Install

### Build

```bash
cd tabby-scroll-fix
npm install --legacy-peer-deps
npx webpack
```

### Install into Tabby

```bash
cd %APPDATA%\tabby\plugins        # Windows
# cd ~/.config/tabby/plugins      # Linux
# cd ~/Library/Application\ Support/tabby/plugins  # macOS

npm init -y
npm install /path/to/tabby-scroll-fix
```

Restart Tabby. The plugin should appear in **Settings > Plugins**.

### Install from tarball (recommended on Windows)

Symlinks from `npm install <local-path>` can cause issues on Windows. Use a tarball instead:

```bash
cd tabby-scroll-fix
npm pack

cd %APPDATA%\tabby\plugins
npm init -y
npm install /path/to/tabby-scroll-fix/tabby-scroll-fix-1.0.0.tgz
```

Restart Tabby.

## Uninstall

```bash
cd %APPDATA%\tabby\plugins
npm uninstall tabby-scroll-fix
```

Restart Tabby.

## Troubleshooting

If the plugin doesn't appear in Settings > Plugins:

1. Open Tabby dev tools (`Ctrl+Shift+I` or `F12`)
2. Check the console for plugin loading errors
3. Verify `dist/index.js` exists after building
4. Ensure `package.json` has `"keywords": ["tabby-plugin"]` and an `"author"` field — Tabby's plugin loader crashes without it

## License

MIT
