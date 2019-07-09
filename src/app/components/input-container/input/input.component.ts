import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Observable, pipe, UnaryFunction} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {hook$} from '../../reactive-hook';

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
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements OnChanges {

  @Input() state: { value: number };

  @hook$('onChanges') onChanges$: Observable<SimpleChanges>;

  state$: Observable<{ value: number }> = this.onChanges$
    .pipe(this.fromInput('state'));

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }


  fromInput(prop: string): UnaryFunction {
    return pipe(
      map((change: SimpleChanges) => change[prop].currentValue),
      distinctUntilChanged()
    );
  }
}
