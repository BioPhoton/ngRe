import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {OptionsState} from './options-state';

@Component({
  selector: 'app-pipe-tests-panel',
  template: `
    <div *ngIf="state$$ | push$ as state">
      <div *ngIf="state.async">
        async-pipe: {{primitiveInterval$ | push$}}
      </div>
      <div *ngIf="state.primitive">
        primitiveInterval$ | push: {{primitiveInterval$ | push$}}
      </div>
      <div *ngIf="state.mutable">
        mutableInterval$ | push: {{(mutableInterval$ | push$)?.value}}
      </div>
      <div *ngIf="state.mutableArgs">
        mutableInterval$ | push:forwardOnlyNewRefs: {{(mutableInterval$ | push$)?.value}}
      </div>
      <div *ngIf="state.immutable">
        immutableInterval$ | push: {{(immutableInterval$ | push$)?.value}}
      </div>
      <div *ngIf="state.input">
        <h1 style="color: red">
          Why is it not passing the input boundary??
        </h1>
        <app-display
          [value]="primitiveInterval$ | push$">
        </app-display>
      </div>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipeTestsPanelComponent {

  @Input()
  @Input$('state')
  state$$: Observable<OptionsState>;

  constructor() {
  }

}
