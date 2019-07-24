import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Input$} from 'ng-re';


@Component({
  selector: 'app-input2',
  template: `
    <h2>Input$ Child2</h2>
    <pre>
      state$: {{state$ | async | json}}<br>
      state2$: {{state2$ | async | json}}
    </pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Input2Component {

  @Input$()
  @Input('state')
  state$;

  @Input$()
  @Input('state2')
  state2$;

  constructor() {
    console.log('CTRO2 input child', this.state$);
  }

}
