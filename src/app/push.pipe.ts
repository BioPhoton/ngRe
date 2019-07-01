import {ChangeDetectorRef, OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {isObservable, Observable, of, Subject} from 'rxjs';
import {distinctUntilChanged, switchAll, takeUntil, tap} from 'rxjs/operators';
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
  private currentObs: Observable<any> | null = null;

  ngOnDestroy$ = new Subject();
  observablesToSubscribe$ = new Subject<Observable<any>>();

  handleChangesSideEffect$ = this.observablesToSubscribe$.pipe(
    // @TODO Minor improvement:
    // @TODO We can't implement detecting changes of the incoming observable with distinctUntilChanged() operator here.
    // @TODO (which could be good because we could get rid of this.currentObs !== obs)
    // @TODO The reason for this is we compose the distinctUntilChanged()
    // @TODO operator onto the observable before we next it on observablesToSubscribe$.
    // only forward new references (avoids holding a local reference to the previous observable => this.currentObs !== obs)
    // distinctUntilChanged(),

    // trigger change detection for new observables bound in the template
    detectChanges(this.cdRef),

    // unsubscribe from previous observables
    // then flatten the latest internal observables into the output
    switchAll(),

    // assign value
    tap(v => this.value = v),

    // trigger change detection for distinct <xvalues
    detectChanges(this.cdRef),

    // unsubscribe if component gets destroyed
    takeUntil(this.ngOnDestroy$)
  );

  constructor(private cdRef: ChangeDetectorRef) {
    this.handleChangesSideEffect$
      .pipe(
        takeUntil(this.ngOnDestroy$)
      )
      .subscribe();
  }

  // @TODO Minor improvement: Use observable lifecycle hooks
  ngOnDestroy(): void {
    this.ngOnDestroy$.next(true);
  }

  // @TODO Minor improvement: We could get rid of this line if we remove the onPush param
  // @TODO And only forward new references
  transform<T>(obs: null | undefined, forwardOnlyNewReferences: boolean): null;
  transform<T>(obs: Observable<T>, forwardOnlyNewReferences: boolean): T;
  transform(obs: Observable<any> | null | undefined, forwardOnlyNewReferences = true): any {
    if (!isObservable(obs)) {
      // @TODO Minor improvement: As discussed in handleChangesSideEffect$ we could get rid of this line
      this.currentObs = of(null);
      this.observablesToSubscribe$.next(this.currentObs);
    } else {
      // @TODO Minor improvement: As discussed in handleChangesSideEffect$ we could get rid of this line
      if (this.currentObs !== obs) {
        // @TODO Minor improvement: As discussed in handleChangesSideEffect$ we could get rid of this line
        this.currentObs = obs;
        // if onPush === true then check if value is referentially equal to previous
        const distinctObs = forwardOnlyNewReferences ? obs.pipe(distinctUntilChanged()) : obs;
        this.observablesToSubscribe$.next(distinctObs);
      }
    }

    return this.value;
  }
}
