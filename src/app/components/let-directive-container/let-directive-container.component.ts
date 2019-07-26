import {Component} from '@angular/core';
import {interval, Observable} from 'rxjs';
import {filter, map, share} from 'rxjs/operators';

@Component({
  selector: 'app-let-directive-container',
  template: `
    <h1>*ngReLet Container</h1>
    <ul>
      <li>
        <a routerLink="./full-example">Full Example</a>
      </li>
      <li>
        <a routerLink="./handling-conditions">Handling Conditions</a>
      </li>
    </ul>
    <router-outlet></router-outlet>`
})
export class LetDirectiveContainerComponent {

  test$ = this.getHotRandomInterval('test$', 1000);
  test2$ = this.getHotRandomInterval('test2$', 1000);
  observables$ = {test: this.test$, test2: this.test2$};

  constructor() {
  }

  getHotRandomInterval(name: string, intVal: number = 1000): Observable<{ [key: string]: number }> {
    return interval(intVal)
      .pipe(
        map(_ => ({[name]: Math.random()})),
        share(),
        filter((v, i) => i < 1)
      );
  }
}
