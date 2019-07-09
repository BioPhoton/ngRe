import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {interval, Observable, timer} from 'rxjs';
import {map} from 'rxjs/operators';
import {hook$} from '../reactive-hook';

@Component({
  selector: 'app-reactive-life-cycle-hooks-container',
  template: `
    <h1>
      reactive-lifecycle-hooks-container works!
    </h1>
    {{state$ | push | json}}
    <app-reactive-lifecycle-hooks [state]="state$ | async"></app-reactive-lifecycle-hooks>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactiveLifeCycleHooksContainerComponent implements OnInit {

  initialState = {
    value: 0,
    options: [1, 2, 3, 4, 5]
  };

  state$ = timer(0, 1000)
    .pipe(
      map(v => ({
        ...this.initialState,
        value: v
      }))
    );

  @hook$('onInit') onInit$: Observable<void>;
  constructor() {
    this.onInit$.subscribe(console.log);
  }

  ngOnInit() {
    console.log('adfangOnInitngOnInitngOnInitngOnInitngOnInitngOnInitdsfsdafasfasdfas');
  }

}
