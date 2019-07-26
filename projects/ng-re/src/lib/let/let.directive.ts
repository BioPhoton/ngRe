import {ChangeDetectorRef, Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {invalidInputValueError} from 'ng-re/lib/core/invalid_pipe_argument_error';
import {animationFrameScheduler, combineLatest, EMPTY, isObservable, Observable, of, ReplaySubject} from 'rxjs';
import {observeOn, startWith, switchMap, tap} from 'rxjs/operators';
import {LocalStateService} from '../local-state/local-state';
import {selectSlice} from '../local-state/operators/selectSlice';

const selector = 'ngReLet';

export class LetContext {
  constructor(
    // to enable let we have to use $implicit
    public $implicit?: any,
    // to enable as we have to assign this
    public ngReLet?: any
  ) {
  }
}

@Directive({
  selector: '[ngReLet]',
  providers: [LocalStateService]
})
export class LetDirective implements OnInit {
  private context = new LetContext({});
  private af$ = new ReplaySubject(1);

  @Input()
  set ngReLet(o: { [key: string]: Observable<any> } | Observable<any>) {
    if (o === null || o === undefined) {
      this.lS.connectSlices({[selector]: EMPTY});
    } else if (isObservable(o)) {
      this.lS.connectSlices({[selector]: o});
    } else {
      throw invalidInputValueError(LetDirective, selector);
    }
  }

  @Input()
  set afOn(o: boolean) {
    this.af$.next(o);
  }

  constructor(
    private lS: LocalStateService,
    private cd: ChangeDetectorRef,
    private readonly templateRef: TemplateRef<LetContext>,
    private readonly viewContainerRef: ViewContainerRef
  ) {
    this.context.$implicit = undefined;
    this.context.ngReLet = undefined;

    combineLatest(
      this.lS.state$.pipe(selectSlice((s) => s[selector])),
      this.af$.pipe(startWith(false)))
      .pipe(
        switchMap(([state, af]) => af ?
          // apply scheduling
          of(state).pipe(observeOn(animationFrameScheduler)) :
          of(state)),
        // running zone-less
        // @TODO replace with detectChange after ivy fix
        tap(_ => this.cd.markForCheck())
      )
      .subscribe(this.updateContext);
  }

  updateContext = (v) => {
    // to enable `let` syntax we have to use $implicit (var; let v = var)
    this.context.$implicit = v;
    // to enable `as` syntax we have to assign the directives selector (var as v)
    this.context.ngReLet = v;
    // @TODO Too much and remove?
    // tslint:disable-next-line
    Object.entries(v || {}).map(([key, value]) => {
      console.log('key', key, value);
      return this.context[key] = value;
    });
  }

  ngOnInit() {
    this.viewContainerRef
      .createEmbeddedView(this.templateRef, this.context);
  }

}
