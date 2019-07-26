import {ChangeDetectorRef, Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {invalidInputValueError} from 'ng-re/lib/core/invalid_pipe_argument_error';
import {animationFrameScheduler, combineLatest, isObservable, Observable, of, ReplaySubject} from 'rxjs';
import {observeOn, switchMap, tap} from 'rxjs/operators';
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
  selector: '[' + selector + ']',
  providers: [LocalStateService]
})
export class LetDirective implements OnInit {
  private context = new LetContext({});
  private af$ = new ReplaySubject(1);

  @Input()
  set ngReLet(o: { [key: string]: Observable<any> } | Observable<any>) {
    if (isObservable(o)) {
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
    this.context.$implicit = {};
    this.context.ngReLet = {};

    combineLatest(
      this.lS.state$.pipe(selectSlice((s) => s[selector])),
      this.af$)
      .pipe(
        // apply scheduling
        switchMap(([state, af]) => {
          return of(state)
            .pipe(observeOn(af ? animationFrameScheduler : null));
        }),
        // running zone-less
        tap(_ => this.cd.detectChanges())
      )
      .subscribe(this.updateContext);
  }

  updateContext = (v) => {
    // to enable `let` syntax we have to use $implicit
    this.context.$implicit = v;
    // to enable `as` syntax we have to assign the directives selector
    this.context.ngReLet = v;
    // @TODO Too much and remove?
    // tslint:disable-next-line
    v && Object.entries(v).map(([key, value]) => this.context[key] = value);
  };

  ngOnInit() {
    this.viewContainerRef
      .createEmbeddedView(this.templateRef, this.context);
  }

}
