import {ChangeDetectionStrategy, Component} from '@angular/core';
import {timer} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-reactive-life-cycle-hooks-container',
  template: `
    <p>
      reactive-lifecycle-hooks-container works!
    </p>
    {{state$ | push | json}}
    <app-reactive-lifecycle-hooks [state]="state$ | async"></app-reactive-lifecycle-hooks>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LifeCycleHooksContainerComponent {

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

  constructor() {
  }

}
