import {AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs';
import {Hook$} from '../../../addons/decorators/hook';
import {getChange} from '../../../addons/rxjs/operators/getChange';
// import {Observable} from 'rxjs';
// import {hook$} from '../../../addons/decorators/hook';
// import {getChange} from '../../../addons/rxjs/operators/getChange';

@Component({
  selector: 'app-input',
  template: `
    <p>
      input works!
    </p>
    <pre>
      state: {{state | json}}
    </pre>
    <pre>
      state$: {{state$ | push | json}}
    </pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements OnChanges, AfterViewInit {

  @Hook$('onChanges') onChanges$: Observable<SimpleChanges>;

  @Input() state: { value: number };
  state$: Observable<{ value: number }> = this.onChanges$.pipe(getChange('state'));

  constructor() {

  }

  // @TODO remove after fixed reactive hooks
  ngOnChanges(changes: SimpleChanges): void {

  }

  ngAfterViewInit(): void {
    console.log('InputComponent ngAfterViewInit');
  }

}
