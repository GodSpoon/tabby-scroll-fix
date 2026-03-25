/**
 * Filters escape sequences that cause viewport jumping in Tabby/xterm.js
 * when Claude Code re-renders its TUI.
 *
 * - \x1b[3J (ED 3 — clear scrollback buffer) is stripped entirely
 * - \x1b[2J (ED 2 — clear screen) is replaced with \x1b[H\x1b[J
 *   (cursor home + erase below) which clears in-place without
 *   pushing content into scrollback
 *
 * See: https://github.com/anthropics/claude-code/issues/769
 */

const ESC_3J = '\x1b[3J'
const ESC_2J = '\x1b[2J'
const CURSOR_HOME_ERASE = '\x1b[H\x1b[J'

export function filterTerminalOutput (data: string): string {
    if (data.includes(ESC_2J)) {
        data = data.split(ESC_2J).join(CURSOR_HOME_ERASE)
    }
    if (data.includes(ESC_3J)) {
        data = data.split(ESC_3J).join('')
    }
    return data
}
