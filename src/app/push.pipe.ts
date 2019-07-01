import {ChangeDetectorRef, OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {isObservable, Observable, of, Subject} from 'rxjs';
import {distinctUntilChanged, map, switchAll, takeUntil, tap, withLatestFrom} from 'rxjs/operators';
import {detectChanges} from './detectChanges';

/**
 * @description
 *
 * Unwraps a value from an asynchronous primitive.
 *
 * The `push` pipe subscribes to an `Observable` and returns the latest value it has
 * emitted. When a new value is emitted, the `push` pipe detects change in the component.
 * When the component gets destroyed, the `push` pipe unsubscribes automatically to avoid
 * potential memory leaks.
 *
 */
@Pipe({name: 'push', pure: false})
export class PushPipe implements PipeTransform, OnDestroy {
  private value: any = null;

  checkReference$$ = new Subject<boolean>();
  ngOnDestroy$$ = new Subject<boolean>();
  observablesToSubscribe$ = new Subject<Observable<any>>();

  handleChangesSideEffect$ = this.observablesToSubscribe$.pipe(
    // only forward new references (avoids holding a local reference to the previous observable => this.currentObs !== obs)
    distinctUntilChanged(),

    // if onPush === true then check if value is referentially equal to previous
    withLatestFrom(this.checkReference$$),
    map(([o$, checkReference]) => checkReference ? o$.pipe(distinctUntilChanged()) : o$),

    // trigger change detection for new observables bound in the template
    detectChanges(this.cdRef),

    // unsubscribe from previous observables
    // then flatten the latest internal observables into the output
    switchAll(),

    // assign value
    tap(v => this.value = v),

    // trigger change detection for distinct values
    detectChanges(this.cdRef),

    // unsubscribe if component gets destroyed
    takeUntil(this.ngOnDestroy$$)
  );

  constructor(private cdRef: ChangeDetectorRef) {
    this.handleChangesSideEffect$
      .pipe(takeUntil(this.ngOnDestroy$$))
      .subscribe();
  }

  // @TODO Minor improvement: Use observable lifecycle hooks over decorators
  ngOnDestroy(): void {
    this.ngOnDestroy$$.next(true);
  }

  transform<T>(obs: null | undefined, forwardOnlyNewReferences: boolean): null;
  transform<T>(obs: Observable<T>, forwardOnlyNewReferences: boolean): T;
  transform<T>(obs: Observable<T> | null | undefined, forwardOnlyNewReferences = true): T | null {
    this.checkReference$$.next(forwardOnlyNewReferences);
    this.observablesToSubscribe$.next(!isObservable(obs) ? of(null) : obs);
    return this.value;
  }
}
