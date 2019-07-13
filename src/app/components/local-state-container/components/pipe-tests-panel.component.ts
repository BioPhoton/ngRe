import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReplaySubject, Subject} from 'rxjs';
import {OptionsState} from './options.state';

@Component({
  selector: 'app-pipe-tests-panel',
  template: `
    <div *ngIf="state$$ | async as state">
      <div *ngIf="state.async">
        async-pipe: {{primitiveInterval$ | async}}
      </div>
      <div *ngIf="state.primitive">
        primitiveInterval$ | push: {{primitiveInterval$ | push}}
      </div>
      <div *ngIf="state.mutable">
        mutableInterval$ | push: {{(mutableInterval$ | push)?.value}}
      </div>
      <div *ngIf="state.mutableArgs">
        mutableInterval$ | push:forwardOnlyNewRefs: {{(mutableInterval$ | push:isNew)?.value}}
      </div>
      <div *ngIf="state.immutable">
        immutableInterval$ | push: {{(immutableInterval$ | push)?.value}}
      </div>
      <div *ngIf="state.input">
        <h1 style="color: red">
          Why is it not passing the input boundary??
        </h1>
        <app-display
          [value]="primitiveInterval$ | push">
        </app-display>
      </div>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipeTestsPanelComponent {

  state$$ = new ReplaySubject(1);

  @Input()
  set state(state: OptionsState) {
    this.state$$.next(state);
  }

  constructor() {
  }

}
