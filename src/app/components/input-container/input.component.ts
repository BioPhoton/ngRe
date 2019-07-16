import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Input$, ObserveProperty} from '../../addons/input$-decorator/input$';

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
  @ObserveProperty('state')
  state$;

  constructor() {
    console.log('CTRO input child', this.state$);
  }

}
