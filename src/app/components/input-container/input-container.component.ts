import {ChangeDetectionStrategy, Component} from '@angular/core';
import {interval, Observable} from 'rxjs';
import {map, share} from 'rxjs/operators';

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

  state$ = this.getHotRandomInterval('val1', 1000);
  state2$ = this.getHotRandomInterval('val2', 3000);

  constructor() {

  }

  getHotRandomInterval(name: string, intVal: number = 1000): Observable<{ [key: string]: number }> {
    return interval(intVal)
      .pipe(
        map(_ => ({[name]: Math.random()})),
        share()
      );
  }

}
