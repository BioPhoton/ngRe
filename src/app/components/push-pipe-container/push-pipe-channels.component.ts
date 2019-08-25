import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {interval} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-push-pipe-channel',
  template: `
    <h2>Channels</h2>
    <p>
      <b>value:</b>
    </p>
    <pre *ngIf="value$ | push$ as value">
      <div>value: {{value}}</div>
    </pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PushPipeChannelsComponent {
  value$ = interval(1000)
    .pipe(
      map((v, i) => {
        if (i === 4) {
          throw new Error('asdfsda');
        }
        return v;
      })
    );
}
