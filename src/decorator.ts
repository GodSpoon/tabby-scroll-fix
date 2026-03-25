import { Injectable } from '@angular/core'
import { TerminalDecorator, BaseTerminalTabComponent } from 'tabby-terminal'
import { filterTerminalOutput } from './middleware'

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
        frontend.write = (data: string) => {
            origWrite(filterTerminalOutput(data))
        }
    }
}
