import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {map, shareReplay, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-sharing-a-reference',
  template: `
    <h2>Sharing a reference</h2>
    <p><b>default$:</b></p>
    <form *ngIf="(formGroup$ | async$) as formGroup" [formGroup]="formGroup">
      <div *ngFor="let c of formGroup.controls | keyvalue">
        <label>{{c.key}}</label>
        <input [formControlName]="c.key"/>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharingAReferenceComponent {
  state$ = new ReplaySubject(1);
  formGroup$: Observable<FormGroup> = combineLatest(this.state$, this.router.params)
    .pipe(
      map(this.preparingFormGroupConfig),
      map(formGroupConfig => this.fb.group(formGroupConfig)),
      shareReplay(1)
    );

  @Input()
  set formGroupModel(value) {
    this.state$.next(value);
  }

  @Output() formValueChange = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private router: ActivatedRoute
  ) {
    this.formGroup$
      .pipe(
        switchMap((fg: FormGroup) => fg.valueChanges)
      )
      .subscribe(v => this.formValueChange.emit(v));
  }

  preparingFormGroupConfig([modelFromInput, modelFromRouterParams]) {
    // override defaults with router params if exist
    return Object.entries({...modelFromInput, ...modelFromRouterParams})
      .reduce((c, [name, initialValue]) => ({...c, [name]: [initialValue]}), {});
  }

}
