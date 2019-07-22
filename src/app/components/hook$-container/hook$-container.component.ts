import {ChangeDetectionStrategy, Component} from '@angular/core';
import {timer} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-reactive-life-cycle-hooks-container',
  template: `
    <h1>Hook$(hookName) Container</h1>
    <ul class="top-menu">
      <li>
        <a [routerLink]="['./full-example']">
          Hooks$() Full example
        </a>
      </li>
      <li>
        <a [routerLink]="['./service-hooks']">
          Service LifeCycleHooks
        </a>
      </li>
      <li>
        <a [routerLink]="['./select-change']">
          SelectChange RxJS Operator
        </a>
      </li>
    </ul>
    <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HookContainerComponent {

  initialState = {
    value: 0,
    options: [1, 2, 3, 4, 5]
  };

  state$ = timer(0, 1000)
    .pipe(
      map(v => ({
        ...this.initialState,
        value: v
      }))
    );

}
