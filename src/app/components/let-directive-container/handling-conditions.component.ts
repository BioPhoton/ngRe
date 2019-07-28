import {Component} from '@angular/core';
import {interval, Observable} from 'rxjs';
import {filter, map, share} from 'rxjs/operators';

@Component({
  selector: 'app-let-directive-handling-conditions',
  template: `
    <h2>*ngReLet Handle Conditions</h2>

    <app-let-directive-value *ngIf="boolean1$ | async as val1; else placeholder" [value]="val1">
    </app-let-directive-value>
    <ng-template #placeholder>
      <div class="spin"></div>
    </ng-template>

    <ng-container
      *ngReLet="boolean1$ as val1">
      <pre>{{val1 | json}}</pre>
      <div *ngIf="val1 === undefined; else placeholder"
        class="spin">
        
      </div>
      <ng-template #placeholder>

        <app-let-directive-value *ngIf="val1 === true" [value]="val1">
        </app-let-directive-value>

        <app-let-directive-value *ngIf="val1 === false" [value]="val1">
        </app-let-directive-value>

      </ng-template>
    </ng-container>
  `
})
export class LetDirectiveHandlingConditionsComponent {

  boolean1$: Observable<boolean> = this.getHotRandomBoolena(2000);

  constructor() {
  }

  getHotRandomBoolena(intVal: number = 1000): Observable<boolean> {
    return interval(intVal)
      .pipe(
        map(_ => Math.random() < 0.5),
        share()
      );
  }
}
