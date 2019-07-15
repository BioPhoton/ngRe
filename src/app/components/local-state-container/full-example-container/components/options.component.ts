import {ChangeDetectionStrategy, Component, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {filter, map, shareReplay, switchMap} from 'rxjs/operators';
import {selectSlice} from '../../../../addons/local-state$-service/operators/selectSlice';
import {OptionsState} from './options-state';

@Component({
  selector: 'app-options',
  template: `
    <ng-content></ng-content>
    <form
      *ngIf="(formGroup$ | async) as form"
      [formGroup]="form">
      <label [for]="option"
        *ngFor="let option of config$ | async">
        {{option}}
        <input
          [id]="option"
          type="checkbox"
          [formControlName]="option">
      </label>
    </form>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsComponent {

  localState$$ = new ReplaySubject<OptionsState>(1);

  @Input()
  set state(state: OptionsState) {
    this.localState$$.next(state);
  }

  config$ = this.localState$$.pipe(selectSlice(v => v.config));
  state$ = this.localState$$.pipe(selectSlice(v => v.state));

  formGroup$: Observable<FormGroup> = combineLatest(this.state$, this.config$)
    .pipe(
      map(arr => {
        // @TODO a lot of small adoptions are needed for the undefined case
        if (arr.some(i => i === undefined)) {
          return undefined;
        } else {
          // we derive a formGroup from the passed state
          const config = this.toFormGroupConfig(arr);
          return this.fb.group(config);
        }
      }),
      // we want a single instance fo formGroup for all subscribers
      shareReplay(1)
    );

  @Output() stateChange = this.formGroup$
    .pipe(filter(f => !!f), switchMap(f => f.valueChanges));

  constructor(private fb: FormBuilder) {
  }

  toFormGroupConfig([st, ops]) {
    // map state changes to form config
    return ops
      .reduce((c, o) => ({...c, [o]: [st[o]]}), {});
  }

}
