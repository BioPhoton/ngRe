import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Input$} from 'ng-re';
import {merge, Subject} from 'rxjs';
import {map, scan, shareReplay} from 'rxjs/operators';


@Component({
  selector: 'app-input2',
  template: `
    <h2>Input$ Child2</h2>
    <pre>
      state$: {{state$ | async | json}}<br>
      state2$: {{state2$ | async | json}}
    </pre>
    <p>Component composition</p>
    <pre>
      viewModelA$: {{viewModelA$ | async | json}}
    </pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Input2Component {
  command$$ = new Subject();

  @Input$()
  @Input('state')
  state$;

  @Input$()
  @Input('state2')
  state2$;

  viewModelA$ = merge(
    this.command$$,
    this.state$.pipe(map(state => ({state}))),
    this.state2$.pipe(map(state2 => ({state2}))),
  )
    .pipe(
      scan((st, sl) => ({...st, ...sl}), {})
    );


  constructor() {
    console.log('CTRO2 input child', this.state$);
    const initialState = {
      state: null,
      state2: [],
      otherSlice: {}
    };
    setTimeout(() => {
      console.log('intialState', initialState);
      this.command$$.next(initialState);
    }, 1000);
  }

}
