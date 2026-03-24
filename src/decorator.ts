import { Injectable } from '@angular/core'
import { TerminalDecorator, BaseTerminalTabComponent } from 'tabby-terminal'
import { filterTerminalOutput } from './middleware'

/** Erase from cursor to end of screen — cleans up stale lines after a redraw */
const ERASE_BELOW = '\x1b[J'

@Injectable()
export class ScrollFixDecorator extends TerminalDecorator {
    attach (terminal: BaseTerminalTabComponent): void {
        if (terminal.frontend) {
            this.patchFrontend(terminal)
        }
        this.subscribeUntilDetached(
            terminal,
            terminal.frontendReady$.subscribe(() => this.patchFrontend(terminal)),
        )
    }

    private patchFrontend (terminal: BaseTerminalTabComponent): void {
        const frontend = terminal.frontend
        if (!frontend) {
            return
        }
        const origWrite = frontend.write.bind(frontend)

        let buffer = ''
        let clearScreenPending = false
        let timerId: ReturnType<typeof setTimeout> | null = null

        frontend.write = (data: string) => {
            const result = filterTerminalOutput(data)
            buffer += result.data
            if (result.hadClearScreen) {
                clearScreenPending = true
            }

            // Reset timer on each write to coalesce the full re-render
            if (timerId !== null) {
                clearTimeout(timerId)
            }
            timerId = setTimeout(() => {
                let batch = buffer
                const hadClear = clearScreenPending
                buffer = ''
                clearScreenPending = false
                timerId = null

                if (hadClear) {
                    batch += ERASE_BELOW
                }
                origWrite(batch)
            }, 16)
        }
    }
}
