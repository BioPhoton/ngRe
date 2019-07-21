import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {interval} from 'rxjs';
import {map, share} from 'rxjs/operators';

@Component({
  selector: 'app-input-container',
  template: `
    <h1>Input container</h1>
    <pre>
      value in container: {{state$ | push$ | json}}
      value in container: {{state2$ | push$ | json}}
    </pre>
    <!-- switch to push pipe after ivy fix -->
    <app-input></app-input>
    <app-input2></app-input2>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputContainerComponent {

  state$ = interval(1000)
    .pipe(
      map(value => ({value: Math.random()})),
      share()
    );

  state2$ = interval(3000)
    .pipe(
      map(value => ({value2: Math.random()})),
      share()
    );

  constructor() {

  }

}
