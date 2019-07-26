import {Component} from '@angular/core';
import {interval, Observable} from 'rxjs';
import {filter, map, share} from 'rxjs/operators';

@Component({
  selector: 'app-let-directive-handling-conditions',
  template: `
    <h1>*ngReLet Container</h1>

    <div *ngIf="val1$ | async as o">
      <p><b>*ngIf="test$ | async as o":</b></p>
      <pre>{{o | json}}</pre>
    </div>

    <ng-container
      *ngReLet="val1$ as o">
      <p><b>*reLet="test$ as o":</b></p>
      <pre>{{o | json}}</pre>
    </ng-container>

    <ng-container
      *ngReLet="val1$; let o">
      <p><b>*ngReLet="test$; let o":</b></p>
      <pre>{{o | json}}</pre>
    </ng-container>

    <ng-container *ngReLet="{test:val1$, test2:val2$} as o">
      <p><b>*ngReLet="observables as o":</b></p>
      <pre>{{o | json}}</pre>
      <div *ngIf="o?.test">
        <p><b>*ngIf="o.test":</b></p>
        <pre>{{o?.test | json}}</pre>
      </div>
      <div *ngIf="o?.test2">
        <p><b> *ngIf="o.test2$":</b></p>
        <pre>{{o?.test2 | json}}</pre>
      </div>
    </ng-container>
    <ng-container *ngReLet="{test:val1$, test2:val2$}; test as t; test2 as t2">
      <p><b> *ngReLet="test:test$, test2:test2$; test as t; test2 as t2":</b></p>
      <pre>{{t | json}} : {{t2 | json}}</pre>
    </ng-container>
  `
})
export class LetDirectiveHandlingConditionsComponent {

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
