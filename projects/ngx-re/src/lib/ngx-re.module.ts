import {NgModule} from '@angular/core';
import {Async$Pipe} from './push$-pipe/async$.pipe';
import {Push$Pipe} from './push$-pipe/push$.pipe';
import {Let$Directive} from './let$-directive/let$.directive';

const DECLARATIONS = [
  Let$Directive,
  Push$Pipe,
  Async$Pipe
];

const EXPORTS = [
  DECLARATIONS
];


@NgModule({
  declarations: [
    DECLARATIONS
  ],
  imports: [],
  exports: [
    EXPORTS
  ]
})
export class NgxReModule {
}
