import {AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Hook$, selectChange} from '@ngx-re';

@Component({
  selector: 'app-select-change-container',
  template: `
    <h2>selectChange Container</h2>
    <app-select-change>
    </app-select-change>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectChangeContainerComponent implements OnChanges, AfterViewInit {

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
  }

  ngAfterViewInit(): void {
  }

}
