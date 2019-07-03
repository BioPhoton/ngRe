import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-display',
  template: `
    <p>
      value: {{value | json}}
    </p>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PushPipeDisplayComponent {

  @Input() value;

}
