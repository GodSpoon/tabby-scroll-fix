/**
 * Strips escape sequences that cause viewport jumping and flicker
 * when Claude Code re-renders its TUI in Tabby/xterm.js.
 *
 * - \x1b[3J (ED 3 — clear scrollback buffer) causes scroll-to-top
 * - \x1b[2J (ED 2 — clear entire screen) causes visible flash
 *
 * When \x1b[2J is stripped, the caller should append \x1b[J after
 * the redraw content to erase any stale lines below the cursor.
 *
 * See: https://github.com/anthropics/claude-code/issues/769
 */

const ESC_3J = '\x1b[3J'
const ESC_2J = '\x1b[2J'

export interface FilterResult {
    data: string
    hadClearScreen: boolean
}

export function filterTerminalOutput (data: string): FilterResult {
    let hadClearScreen = false

    if (data.includes(ESC_2J)) {
        data = data.split(ESC_2J).join('')
        hadClearScreen = true
    }
    if (data.includes(ESC_3J)) {
        data = data.split(ESC_3J).join('')
    }

    return { data, hadClearScreen }
}
