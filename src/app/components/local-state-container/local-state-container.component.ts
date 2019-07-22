import {ChangeDetectionStrategy, Component} from '@angular/core';

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
    </ul>
    <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalStateContainerComponent {

}
