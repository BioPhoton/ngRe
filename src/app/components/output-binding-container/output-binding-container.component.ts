import {AfterContentInit, Component} from '@angular/core';
import {defer, fromEvent} from 'rxjs';
import {scan} from 'rxjs/operators';

@Component({
  selector: 'app-from-view-container',
  template: `
    <p>
      from-view-container works!
    </p>
    <button id="btn">Click Me!</button>
    {{valueFromButtonClick$ | push | json}}
    <app-from-view
      (out)="fn($event)"
      id="app-from-view-1">
    </app-from-view>
    {{valueFromCompClick$ | push | json}}
   
  `,
  styles: []
})
export class OutputBindingContainerComponent implements AfterContentInit {

  elem = () => document.getElementById('app-from-view-1');
  valueFromButtonClick$ = defer(() => fromEvent(document.getElementById('btn'), 'click'))
    .pipe(
      scan((a: any): any => ++a, 0)
    );

  valueFromCompClick$ = defer(() =>
    fromEvent(this.elem(), 'click')
  )
    .pipe(
      scan((a: any): any => ++a, 10)
    );

  valueFromOutBinding$ = defer(() =>
    fromEvent(this.elem(), 'out')
  )
    .pipe(
      scan((a: any): any => ++a, 100)
    );

  constructor() {

  }

  ngAfterContentInit() {
    this.elem()
      .addEventListener('out', (v) => {
        console.log('VV', v);
      });
    this.valueFromOutBinding$.subscribe(console.log);
  }

  fn(e) {
    console.log('e', e);
  }

}
