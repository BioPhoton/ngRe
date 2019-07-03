import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <ul>
      <li>
        <a routerLink="push-pipe">PushPipe</a>
      </li>
      <li>
        <a routerLink="live-cycle-hooks">ReactiveLifeCycleHooks</a>
      </li>
    </ul>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {

}
