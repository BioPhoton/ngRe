import {ChangeDetectionStrategy, Component} from '@angular/core';
import {timer} from 'rxjs';
import {shareReplay} from 'rxjs/operators';


@Component({
  selector: 'app-push-pipe-container',
  template: `
    <h1>push$ pipe Container</h1>
    <p><b>primitiveInterval$ | push:</b></p>
    <pre>{{primitiveInterval$ | push$ | json}}</pre>
    <br>
    <app-push-pipe
      [value]="primitiveInterval$ | push$ | json">
    </app-push-pipe>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PushPipeContainerComponent {
  primitiveInterval$ = timer(0, 2000).pipe(shareReplay(1));
}
