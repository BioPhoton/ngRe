import {ChangeDetectionStrategy, Component} from '@angular/core';
import {timer} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-full-example-container',
  template: `
    <h1>Full Example Container</h1>
    <p>
      <b>Container state$:</b>
    </p>
    <pre>
        {{state$ | async$ | json}}
    </pre>
    <app-full-example [state]="state$ | async">
    </app-full-example>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullExampleContainerComponent {

  initialState = {
    value: 0,
    options: [1, 2, 3, 4, 5]
  };

  state$ = timer(0, 1000)
    .pipe(
      map(v => ({
        ...this.initialState,
        value: v
      }))
    );

}
