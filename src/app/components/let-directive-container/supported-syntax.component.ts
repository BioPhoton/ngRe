import {Component} from '@angular/core';
import {combineLatest, interval, Observable} from 'rxjs';
import {filter, map, share, take} from 'rxjs/operators';

@Component({
  selector: 'app-let-directive-supported-syntax',
  template: `
    <h2>*ngrxLet Supported Syntax</h2>
    <p>
      Binding with as syntax <code>*ngrxLet="val1$ as o"</code>
    </p>
    <ng-container
      *ngrxLet="val1$ as o">
      <pre>{{(o | json) || 'undefined'}}</pre>
      <app-let-directive-value [value]="o"></app-let-directive-value>
    </ng-container>

    <p>
      Binding composed object <code>*ngrxLet="combinedInComponent$ as o"</code>
    </p>
    <ng-container
      *ngrxLet="combinedInComponent$ as o">
      <pre>{{o | json}}</pre>
      <app-let-directive-value [value]="o"></app-let-directive-value>
    </ng-container>

    <p>
      Binding an object of single values <code>*ngrxLet="combinedInComponent$ as o; val1 as val1; val2 as val2"</code>
    </p>
    <ng-container
      *ngrxLet="combinedInComponent$; val1 as val1; val2 as val2">
      <pre>{{val1 | json}}</pre>
      <pre>{{val2 | json}}</pre>
      <app-let-directive-value [value]="val1"></app-let-directive-value>
      <app-let-directive-value [value]="val2"></app-let-directive-value>
    </ng-container>

    <p>
      Binding an object of single values <code>*ngrxLet="combinedInComponent$; let val1 = val1; let val2 = val2"</code>
    </p>
    <ng-container
      *ngrxLet="combinedInComponent$; let val1 = val1; let val2 = val2">
      <pre>{{val1 | json}}</pre>
      <pre>{{val2 | json}}</pre>
      <app-let-directive-value [value]="val1"></app-let-directive-value>
      <app-let-directive-value [value]="val2"></app-let-directive-value>
    </ng-container>

    <p>
      Use animationFrameScheduler<code>*ngrxLet="val1$ as o; useAf:true"</code>
    </p>
    <ng-container
      *ngrxLet="val1$ as o; useAf:true">
      <pre>{{(o | json) || 'undefined'}}</pre>
      <app-let-directive-value [value]="o"></app-let-directive-value>
    </ng-container>
  `
})
export class LetDirectiveSupportedSyntaxComponent {

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
