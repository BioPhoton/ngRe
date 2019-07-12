import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-local-state',
  template: `
    <p>
      local-state works!
    </p>
    <br/>
    value: {{value | json}}
  `,
  styles: []
})
export class LocalStateComponent {

  @Input() value;

}
