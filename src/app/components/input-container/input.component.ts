import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Input$} from 'ng-re';

@Component({
  selector: 'app-input',
  template: `
    <h2>Input$ Child1</h2>
    <pre>
      state$: {{state$ | async | json}}
    </pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent {

  @Input$()
  @Input('state')
  state$;

  constructor() {
  }

}
