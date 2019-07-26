import {Component} from '@angular/core';
import {interval, Observable} from 'rxjs';
import {filter, map, share} from 'rxjs/operators';

@Component({
  selector: 'app-let-directive-handling-conditions',
  template: `
    <h1>*ngReLet Handle Conditions</h1>

    <app-let-directive-value *ngIf="val1$ | async as val1; else placeholder" [value]="val1">
    </app-let-directive-value>
    <ng-template #placeholder>
      <div class="spin" style="width: 100px">Placeholder Content Here</div>
    </ng-template>

    <ng-container
      *ngReLet="val1$ as val1">
      <pre>{{val1 | json}}</pre>
      <app-let-directive-value *ngIf="val1; else placeholder" [value]="val1">
      </app-let-directive-value>
      <ng-template #placeholder>
        <div class="spin" style="width: 100px">Placeholder Content Here</div>
      </ng-template>
    </ng-container>
  `
})
export class LetDirectiveHandlingConditionsComponent {

  val1$ = this.getHotRandomInterval('test$', 3000);

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
