import {Component} from '@angular/core';
import {combineLatest, interval, Observable} from 'rxjs';
import {filter, map, share, take} from 'rxjs/operators';

@Component({
  selector: 'app-let-directive-full-example',
  template: `
    <h2>*Full Example</h2>

    <p>
      Binding with as syntax <code>*ngReLet="val1$ as o"</code>
    </p>
    <ng-container
      *ngReLet="val1$ as o">
      <pre>{{(o | json) || 'undefined'}}</pre>
      <app-let-directive-value [value]="o"></app-let-directive-value>
    </ng-container>

    <p>
      Binding composed object <code>*ngReLet="combinedInComponent$ as o"</code>
    </p>
    <ng-container
      *ngReLet="combinedInComponent$ as o">
      <pre>{{o | json}}</pre>
      <app-let-directive-value [value]="o"></app-let-directive-value>
    </ng-container>

    <p>
      Binding an object of single values <code>*ngReLet="combinedInComponent$ as o; val1 as val1; val2 as val2"</code>
    </p>
    <ng-container
      *ngReLet="combinedInComponent$; val1 as val1; val2 as val2">
      <pre>{{val1 | json}}</pre>
      <pre>{{val2 | json}}</pre>
      <app-let-directive-value [value]="val1"></app-let-directive-value>
      <app-let-directive-value [value]="val2"></app-let-directive-value>
    </ng-container>

    <p>
      Binding an object of single values <code>*ngReLet="combinedInComponent$; let val1 = val1; let val2 = val2"</code>
    </p>
    <ng-container
      *ngReLet="combinedInComponent$; let val1 = val1; let val2 = val2">
      <pre>{{val1 | json}}</pre>
      <pre>{{val2 | json}}</pre>
      <app-let-directive-value [value]="val1"></app-let-directive-value>
      <app-let-directive-value [value]="val2"></app-let-directive-value>
    </ng-container>
  `
})
export class LetDirectiveFullExampleComponent {

  val1 = Math.random() * 100;
  val2 = Math.random() * 100;

  val1$ = this.getHotRandomInterval('val1', 1000).pipe(take(2));
  val2$ = this.getHotRandomInterval('val2', 1000).pipe(take(2));
  combinedInComponent$ = combineLatest(
    this.val1$,
    this.val2$,
    (val1, val2) => ({...val1, ...val2}));

  constructor() {
  }

  getHotRandomInterval(name: string, intVal: number = 1000): Observable<{ [key: string]: string }> {
    return interval(intVal)
      .pipe(
        map((_, i) => ({[name]: i + ':' + Math.random()})),
        share(),
        filter((v, i) => i < 1)
      );
  }
}
