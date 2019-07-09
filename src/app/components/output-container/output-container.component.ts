import {AfterContentInit, ChangeDetectionStrategy, Component} from '@angular/core';
import {defer, fromEvent} from 'rxjs';
import {scan} from 'rxjs/operators';

@Component({
  selector: 'app-output-container',
  template: `
    <p>output-container works!</p>
    <br>
    <button id="btn">Click Me!</button>
    <br>
    {{valueFromButtonClick$ | push | json}}
    <br>
    <app-output
      (out)="fn($event)"
      id="app-from-view-1">
    </app-output>
    <br>
    valueFromCompClick$: {{valueFromCompClick$ | push | json}}
    <br>
    valueFromOutBinding$: {{valueFromOutBinding$ | push | json}}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutputContainerComponent implements AfterContentInit {

  valueFromButtonClick$ = defer(() => fromEvent(document.getElementById('btn'), 'click'))
    .pipe(scan((a: any): any => ++a, 0));

  valueFromCompClick$ = defer(() => fromEvent(this.elem(), 'click'))
    .pipe(scan((a: any): any => ++a, 10));

  valueFromOutBinding$ = defer(() => fromEvent(this.elem(), 'out'))
    .pipe(scan((a: any): any => ++a, 100));

  constructor() {

  }

  elem = () => document.getElementById('app-from-view-1');

  ngAfterContentInit() {
    this.valueFromButtonClick$.subscribe(console.log);

    this.elem()
      .addEventListener('out', (v) => {
        console.log('VV', v);
      });
  }

  fn(e) {
    console.log('e', e);
  }

}
