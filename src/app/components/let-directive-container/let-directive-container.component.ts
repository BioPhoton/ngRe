import {Component} from '@angular/core';
import {interval, Observable} from 'rxjs';
import {filter, map, share} from 'rxjs/operators';

@Component({
  selector: 'app-let-directive-container',
  template: `
    <h1>*ngrxLet Container</h1>
    <ul>
      <li>
        <a routerLink="./full-example">Full Example</a>
      </li>
      <li>
        <a routerLink="./observable-channels">Observable Channels</a>
      </li>
    </ul>
    <router-outlet></router-outlet>`
})
export class LetDirectiveContainerComponent {

}
