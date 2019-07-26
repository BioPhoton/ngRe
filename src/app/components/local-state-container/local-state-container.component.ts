import {ChangeDetectionStrategy, Component} from '@angular/core';
import {timer} from 'rxjs';
import {map} from 'rxjs/operators';
import {randomName} from './random';

@Component({
  selector: 'app-local-state-container',
  template: `
    <h1>LocalStateService Container</h1>
    <ul class="top-menu">
      <li>
        <a [routerLink]="['./state-clean-up']">
          SelectSlice RxJS Operator
        </a>
      </li>
      <li>
        <a [routerLink]="['./late-subscriber']">
          Late Subscriber
        </a>
      </li>
      <li>
        <a [routerLink]="['./early-producer']">
          Early Producer
        </a>
      </li>
      <li>
        <a [routerLink]="['./full-example']">
          Full Example
        </a>
      </li>
      <li>
        <a [routerLink]="['./sharing-a-reference', (prefilledData$ | async) || {}]">
          Sharing A Reference (optional params: {{prefilledData$ | async | json}})
        </a>
      </li>

      <li>
        <a [routerLink]="['./placeholder-content']">
          Placeholder Content
        </a>
      </li>
    </ul>
    <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalStateContainerComponent {
  prefilledData$ = timer(0, 2000)
    .pipe(
      map(i => i % 2 ? {
          name: randomName(),
          age: parseInt(Math.random() * 100 + '', 10)
        } : {}
      )
    );
}
