import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-push-pipe',
  template: `
    <h2>push$ Child</h2>
    <p>
      <b>value:</b>
    </p>
    <pre>
      {{value | json}}
    </pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PushPipeComponent {
  @Input() value;
}
