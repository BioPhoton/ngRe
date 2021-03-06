import {Component} from '@angular/core';

@Component({
  selector: 'app-avoid-rx-container',
  template: `
    <h2>Avoid Reactive Programming</h2>
    <ul>
      <li>
        <a [routerLink]="['sync-with-class-property']">sync-with-class-property</a>
      </li>
    </ul>
    <!-- 
    <router-outlet></router-outlet> 
    <app-avoid-rx-subscription></app-avoid-rx-subscription>
    -->
    <app-avoid-subscription></app-avoid-subscription>
  `
})
export class AvoidReactivityContainerComponent {

}
