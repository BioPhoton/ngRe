import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-display',
  template: `
    <p>
      value: {{value | json}}
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PushPipeComponent {

  @Input() value;

}