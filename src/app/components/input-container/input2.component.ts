import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Input$} from '../../addons/input$-decorator/input$';

@Component({
  selector: 'app-input2',
  template: `
    <h2>Input child component</h2>
    <pre>
      state$: {{state$ | async | json}}<br>
      state2$: {{state2$ | async | json}}
    </pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Input2Component {

  @Input()
  state;
  @Input$('state')
  state$;

  @Input()
  state2;
  @Input$('state2')
  state2$;

  constructor() {
    console.log('CTRO2 input child', this.state$);
  }

}
