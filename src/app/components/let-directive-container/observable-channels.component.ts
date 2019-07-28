import {Component} from '@angular/core';
import {interval, Observable} from 'rxjs';
import {filter, map, share, take} from 'rxjs/operators';

@Component({
  selector: 'app-let-directive-observable-channels',
  template: `
    <h2>*ngReLet Observable Channels</h2>

    <button (click)="assignObservable()">assignObservable</button>
    <button (click)="assignUndefined()">assignUndefined</button>

    <ng-container
      *ngReLet="val1$ as val1; let error = $error; let complete = $complete">
      <p><b>next:</b></p>
      <pre>{{(val1 | json) || 'undefined'}}</pre>
      <p><b>error:</b></p>
      <pre>{{(error | json) || 'undefined'}}</pre>
      <p><b>complete:</b></p>
      <pre>{{(complete | json) || 'undefined'}}</pre>
    </ng-container>
  `
})
export class LetDirectiveObservableChannelsComponent {

  val1$;

  constructor() {
  }

  assignObservable() {
    this.val1$ = this.getHotRandomInterval('test$', 1000).pipe(take(5));
  }

  assignUndefined() {
    this.val1$ = undefined;
  }

  getHotRandomInterval(name: string, intVal: number = 1000): Observable<{ [key: string]: number }> {
    return interval(intVal)
      .pipe(
        map(_ => ({[name]: Math.random()})),
        share()
      );
  }
}
