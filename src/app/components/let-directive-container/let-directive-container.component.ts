import {Component, OnInit} from '@angular/core';
import {interval} from 'rxjs';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-let-directive-container',
  template: `
    <h1>*reLet Container</h1>

    <div *ngIf="test$ as o">
      {{o | json}}
    </div>
    <!--    <ng-container
      *reLet="test$ as o">
      <p>
        value: {{o | json}}
      </p>
    </ng-container>
    <ng-container
      *reLet="{
        test$: test$,
        test2$: test2$
      } as o">
      <p>
        value: {{o | json}}
      </p>
      <p *ngIf="o.test$">
        o.test$: {{o.test$ | json}}
      </p>
      <p *ngIf="o.test2$">
        o.test2$: {{o.test2$ | json}}
      </p>
    </ng-container>
    -->
  `,
  styles: []
})
export class LetDirectiveContainerComponent implements OnInit {

  test$ = interval(1000).pipe(take(1));
  test2$ = interval(500).pipe(take(1));

  constructor() {
  }

  ngOnInit() {
  }

}
