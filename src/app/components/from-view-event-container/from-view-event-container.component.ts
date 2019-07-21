import {AfterContentInit, ChangeDetectionStrategy, Component} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-output-container',
  template: `
    <h1>FromViewEvent$ Container</h1>
    <p><b>Last received output:</b></p>
    <pre>
      {{clicks$ | async | json}}
    </pre>
    <button
      (click)="clicks$.next($event)">
      Click Me!
    </button>
    <br>
    <app-from-view-event
      (click)="clicks$.next($event)"
      (out)="clicks$.next($event)">
    </app-from-view-event>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FromViewEventContainerComponent implements AfterContentInit {

  clicks$ = new Subject();

  constructor() {

  }

  ngAfterContentInit() {
    this.clicks$.subscribe(console.log);
  }
}
