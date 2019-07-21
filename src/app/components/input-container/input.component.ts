import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Input$} from '@ngx-re';

@Component({
  selector: 'app-input',
  template: `
    <h2>Input child component</h2>
    <pre>
      state$: {{state$ | async | json}}
    </pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent {

  @Input()
  state;

  @Input$('state')
  state$;

  constructor() {
  }

}
