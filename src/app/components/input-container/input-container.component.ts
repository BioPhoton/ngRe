import {ChangeDetectionStrategy, Component} from '@angular/core';
import {interval, Observable, timer} from 'rxjs';
import {map, share, take} from 'rxjs/operators';

@Component({
  selector: 'app-input-container',
  template: `
    <h1>Input$() Container</h1>
    <pre>
      value in container: {{state$ | push$ | json}}
      value in container: {{state2$ | push$ | json}}
    </pre>
    <!-- @TODO switch to push$ pipe after ivy fix -->
    <app-input
      [state]="state$ | async$">
    </app-input>
    <app-input2
      [state]="state$ | async$"
      [state2]="state2$ | async$">
    </app-input2>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputContainerComponent {

  state$ = this.getHotRandomInterval('val1', 1).pipe(take(2));
  state2$ = this.getHotRandomInterval('val2', 3).pipe(take(2));

  constructor() {

  }

  getHotRandomInterval(name: string, intVal: number = 1000): Observable<{ [key: string]: number }> {
    return timer(0, intVal)
      .pipe(
        map(_ => ({[name]: Math.random()})),
        share()
      );
  }

}
