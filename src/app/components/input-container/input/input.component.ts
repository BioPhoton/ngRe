import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {of} from 'rxjs';

@Component({
  selector: 'app-input',
  template: `
    <pre>
      state$: {{state$ | async | json}}
    </pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent {

  @Input()
  state;
  state$ = of(null);

  constructor() {

  }

}
