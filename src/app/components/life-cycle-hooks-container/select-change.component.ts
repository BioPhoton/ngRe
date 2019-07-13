import {AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Hook$} from '../../addons/decorators/hook';
import {selectChange} from '../../addons/rxjs/operators/selectChange';

@Component({
  selector: 'app-select-change',
  template: `state$: {{state$ |async | json}}    `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectChangeComponent implements OnChanges, AfterViewInit {

  public state = 0;
  @Hook$('onChanges')
  onChanges$;

  @Input()
  value: { value: number };
  state$ = this.onChanges$.pipe(selectChange('value'));

  constructor() {

  }

  // @TODO remove after fixed reactive hooks
  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes);
  }

  ngAfterViewInit(): void {
    console.log('InputComponent ngAfterViewInit');
  }

}
