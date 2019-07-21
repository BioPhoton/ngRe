import {AfterContentInit, ChangeDetectionStrategy, Component} from '@angular/core';
import {ObservableEvent as Event$} from '@typebytes/ngx-template-streams';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-output-container',
  template: `
    <button (*click)="clicks$.next($event)">Click Me!</button>
    <br>
    <app-output></app-output>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutputContainerComponent implements AfterContentInit {

  clicks$ = new Subject();

  constructor() {

  }

  ngAfterContentInit() {
    this.clicks$.subscribe(console.log);
  }
}
