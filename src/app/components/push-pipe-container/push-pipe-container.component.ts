import {ChangeDetectionStrategy, Component} from '@angular/core';
import {timer} from 'rxjs';
import {shareReplay} from 'rxjs/operators';


@Component({
  selector: 'app-push-pipe-container',
  template: `
    primitiveInterval$ | push: {{primitiveInterval$ | push$}}
    <br>
    <app-push-pipe
      [value]="primitiveInterval$ | push$">
    </app-push-pipe>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PushPipeContainerComponent {
  primitiveInterval$ = timer(0, 100).pipe(shareReplay(1));
}
