import {ChangeDetectorRef, Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {invalidInputValueError} from 'ng-re/lib/core/invalid_pipe_argument_error';
import {
  animationFrameScheduler,
  combineLatest,
  isObservable,
  NEVER,
  NextObserver,
  Observable,
  Observer,
  ReplaySubject,
  Subject
} from 'rxjs';
import {isObject} from 'rxjs/internal-compatibility';
import {map, observeOn, startWith, switchAll, takeUntil, tap} from 'rxjs/operators';

const selector = 'ngrxLet';

export class LetContext {
  constructor(
    // to enable let we have to use $implicit
    public $implicit?: any,
    // to enable as we have to assign this
    public ngrxLet?: any,
    // value of error of undefined
    public $error?: any,
    // true or undefined
    public $complete?: any
  ) {
  }
}

@Directive({
  selector: '[ngrxLet]'
})
export class LetDirective<T> implements OnInit, OnDestroy {
  private onDestroy$ = new Subject();

  private ViewContext = new LetContext();
  private af$ = new ReplaySubject(1);
  private observables$: ReplaySubject<Observable<T>> = new ReplaySubject(1);

  @Input()
  set ngrxLet(o: Observable<T>) {
    if (o === null || o === undefined) {
      this.observables$.next(NEVER);
    } else if (isObservable(o)) {
      this.observables$.next(o);
    } else {
      throw invalidInputValueError(LetDirective, selector);
    }
  }

  @Input()
  set ngrxLetUseAf(bool: boolean) {
    this.af$.next(bool);
  }

  resetContextObserver: NextObserver<Observable<T>> = {
    // for every value reset context
    next: (_) => {
      // @TODO find out why we have to mutate the context object
      this.ViewContext.$implicit = undefined;
      this.ViewContext.ngrxLet = undefined;
      this.ViewContext.$error = undefined;
      this.ViewContext.$complete = undefined;
    }
  };

  updateContextObserver: Observer<T> = {
    next: (v) => {
      // @TODO find out why we have to mutate the context object
      // to enable `let` syntax we have to use $implicit (var; let v = var)
      this.ViewContext.$implicit = v;
      // to enable `as` syntax we have to assign the directives selector (var as v)
      this.ViewContext.ngrxLet = v;
      // @TODO Too much and remove?
      if (isObject(v)) {
        Object.entries(v).forEach(([key, value]) => this.ViewContext[key] = value);
      }
    },
    error: (e) => {
      // set context var complete to true (var$; let v = $error)
      this.ViewContext.$error = e;
    },
    complete: () => {
      // set context var complete to true (var$; let v = $complete)
      this.ViewContext.$complete = true;
    }
  };

  constructor(
    private cd: ChangeDetectorRef,
    private readonly templateRef: TemplateRef<LetContext>,
    private readonly viewContainerRef: ViewContainerRef
  ) {
    combineLatest(
      this.observables$.asObservable()
        .pipe(
          tap(this.resetContextObserver),
          tap(_ => this.renderChange())
        ),
      this.af$.pipe(startWith(false))
    )
      .pipe(
        map(([state$, af]) => {
            state$ = af ?
              // apply scheduling
              state$.pipe(observeOn(animationFrameScheduler)) :
              state$;

            return state$.pipe(
              // update context variables
              tap(this.updateContextObserver),
              tap(_ => this.renderChange())
            );
          }
        ),
        switchAll(),
        takeUntil(this.onDestroy$)
      )
      .subscribe();
  }

  renderChange() {
    // @TODO replace with `.detectChange()` after ivy fix
    // running zone-less with detectChange
    this.cd.markForCheck();
  }

  ngOnInit() {
    // @TODO https://github.com/angular/angular/issues/15280#issuecomment-430479166
    // @TODO Also consider  this.viewContainerRef.clear(); maybe in ngOnDestroy?
    this.viewContainerRef
      .createEmbeddedView(this.templateRef, this.ViewContext);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }

}
