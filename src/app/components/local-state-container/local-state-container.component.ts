import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-local-state-container',
  template: `
    <h1>LocalStateService Container</h1>
    <ul class="top-menu">
      <li>
        <a [routerLink]="['./full-example']">
          Full Example
        </a>
      </li>
      <li>
        <a [routerLink]="['./state-clean-up']">
          SelectSlice RxJS Operator
        </a>
      </li>
    </ul>
    <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalStateContainerComponent {

}
