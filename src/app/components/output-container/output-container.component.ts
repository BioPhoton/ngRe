import {AfterContentInit, ChangeDetectionStrategy, Component} from '@angular/core';
import {defer, fromEvent} from 'rxjs';

@Component({
  selector: 'app-output-container',
  template: `
    <button id="btn">Click Me!</button>
    <br>
    <app-output
      (out)="fn($event)"
      id="app-from-view-1">
    </app-output>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutputContainerComponent implements AfterContentInit {

  constructor() {

  }

  elem = () => document.getElementById('app-from-view-1');

  ngAfterContentInit() {
    // this.valueFromButtonClick$.subscribe(console.log);
  }
}
