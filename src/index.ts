import { NgModule } from '@angular/core'
import { TerminalDecorator } from 'tabby-terminal'
import { ScrollFixDecorator } from './decorator'

@NgModule({
    providers: [
        { provide: TerminalDecorator, useClass: ScrollFixDecorator, multi: true },
    ],
})
export default class ScrollFixModule {}
