import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {interval} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {detectChanges} from '../../addons/rxjs/operators/detectChanges';

@Component({
  selector: 'app-input-container',
  template: `
    <p>
      input-container works!
    </p>
    <pre>
      {{state$ | push | json}}
    </pre>
    <!-- switch to push pipe after ivy fix -->
    <app-input [state]="state$ | async"></app-input>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputContainerComponent implements AfterViewInit {

  state$ = interval(1000)
    .pipe(
      map(value => ({value}))
    );

  constructor() {

  }

  ngAfterViewInit(): void {
    console.log('InputContainerComponent ngAfterViewInit');
  }
}
