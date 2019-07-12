import {ChangeDetectionStrategy, Component, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {map, shareReplay, switchMap} from 'rxjs/operators';
import {selectSlice} from '../../../addons/rxjs/operators/selectStateSlice';
import {OptionsStateInterface} from './options-state.interface';

@Component({
  selector: 'app-options',
  template: `
    <div>
      <form
        *ngIf="(formGroup$ | async) as form"
        [formGroup]="form">
        <label [for]="option"
          *ngFor="let option of config$ | async">
          {{option}}
          <input
            [id]="option"
            type="checkbox"
            formControlName="state"
            [value]="option"
          >
        </label>

      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsComponent {

  localState$$ = new ReplaySubject<OptionsStateInterface>(1);

  @Input()
  set state(state: OptionsStateInterface) {
    this.localState$$.next(state);
  }

  options$ = this.localState$$.pipe(selectSlice(v => v.config));
  state$ = this.localState$$.pipe(selectSlice(v => v.state));

  // we derive a formGroup from the passed state
  formGroup$: Observable<FormGroup> = combineLatest(this.state$, this.options$)
    .pipe(
      map(this.toFormGroupConfig),
      map(({config}) => this.fb.group(config)),
      // we want a single instance fo formGroup for all subscribers
      shareReplay(1)
    );

  @Output() stateChange = this.formGroup$
    .pipe(switchMap(f => f.get('state').valueChanges));

  // =============


  constructor(private fb: FormBuilder) {
  }

  // map state changes to form config
  toFormGroupConfig([st, ops]) {
    return ops
      .reduce((c, o) => ({...c, [o]: [st[o]]}), {});
  }

}
