import {ChangeDetectionStrategy, Component} from '@angular/core';
import {of} from 'rxjs';

@Component({
  selector: 'app-late-subscribers-container',
  template: `
    <p><b>state$:</b></p>
    <pre>{{num$ | async | json}}</pre>
    <app-late-subscriber [state]="num$ | async">
    </app-late-subscriber>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LateSubscribersContainerComponent {

  num$ = of(1);

  constructor() {
  }

}
