import {Component} from '@angular/core';
import {interval, Observable} from 'rxjs';
import {filter, map, share, take} from 'rxjs/operators';

@Component({
  selector: 'app-let-directive-full-example',
  template: `
    <h2>*Full Example</h2>

    <p>
      Binding a single value <code>*ngReLet="val1"</code>
    </p>
    <ng-container
      *ngReLet="val1">
      <pre>{{val1 | json}}</pre>
    </ng-container>
    
        <p>
          Binding a single value <code>*ngReLet="val1 as v1"</code>
        </p>
        <ng-container
          *ngReLet="val1 as v1">
          <pre>{{v1 | json}}</pre>
        </ng-container>
    <!--
        <p>
          Binding a single value <code>val1; let v1 = ngReLet</code>
        </p>
        
        <p>
          Binding an object of single values
          <code>*ngReLet="object as o"</code>
        </p>
        <ng-container
          *ngReLet="{v1: val1, v2: val2} as o">
          <pre>{{o | json}}</pre>
        </ng-container>
    
        <p>
          Binding an object of single values
          <code>*ngReLet="objectOverAsyncPipe as o"</code>
        </p>
        <ng-container
          *ngReLet="{v1: val1$ | async, v2: val2$  | async} as o">
          <pre>{{o | json}}</pre>
        </ng-container>
        -->
  `
})
export class LetDirectiveFullExampleComponent {

  val1 = Math.random() * 100;
  val2 = Math.random() * 100;

  val1$ = this.getHotRandomInterval('val1$', 1000).pipe(take(10));
  val2$ = this.getHotRandomInterval('val2$', 1000).pipe(take(10));
  combinedInComponent$ = {val1: this.val1$, val2: this.val2$};

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
