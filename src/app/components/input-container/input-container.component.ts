import {AfterViewInit, ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {interval} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-input-container',
  template: `
    <p>
      input-container works!
    </p>
    <pre>
      {{state$ | push | json}}
    </pre>
    <!-- switch to push pipe after ivy fix -->
    <app-input [state]="state$ | async"></app-input>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputContainerComponent {

  state$ = interval(1000)
    .pipe(
      map(value => ({value}))
    );

  constructor() {

  }

}
