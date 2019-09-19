import {ChangeDetectorRef, NgZone, OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {isZoneLess} from 'ng-re/lib/core/isZoneLess';
import {combineLatest, isObservable, Observable, of, Subject} from 'rxjs';
import {distinctUntilChanged, map, switchAll, takeUntil} from 'rxjs/operators';
import {STATE_DEFAULT} from '../core/state-default';

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
 * it'S clean it's pure :)
 *
 */
// @TODO remove `pure: false` and experiment without zone
@Pipe({name: 'push$', pure: false})
export class PushPipe implements PipeTransform, OnDestroy {
  private forwardOnlyNewReferences$$ = new Subject<boolean>();
  readonly cdFunction: () => void;
  private value: any = STATE_DEFAULT;

  ngOnDestroy$$ = new Subject<boolean>();

  // @TODO fix any types
  observablesToSubscribe$$ = new Subject<Observable<any>>();

  constructor(private cdRef: ChangeDetectorRef, private ngZone: NgZone) {
    if (isZoneLess(this.ngZone)) {
      this.cdFunction = () => this.cdRef.detectChanges();
    } else {
      this.cdFunction = () => this.cdRef.markForCheck();
    }

    const newObservables$ = this.observablesToSubscribe$$
      .pipe(
        // only forward new references (avoids holding a local reference to the previous observable => this.currentObs !== obs)
        distinctUntilChanged(),
      );
    combineLatest(newObservables$,
      // only forward distinct values => less executions
      this.forwardOnlyNewReferences$$.pipe(distinctUntilChanged()))
      .pipe(
        // Handle forwardOnlyNewReferences option
        map(([o, onlyNewRef]) => (onlyNewRef) ? o.pipe(distinctUntilChanged()) : o),
        // unsubscribe from previous observables
        // then flatten the latest internal observables into the output
        switchAll(),
        // unsubscribe if component gets destroyed
        takeUntil(this.ngOnDestroy$$)
      )
      .subscribe(value => {
        // assign value that will get returned from the transform function on the next change detection
        this.value = value;
        // trigger change detection for the to get the newly assigned value rendered
        this.cdFunction();
      });
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$$.next(true);
  }

  transform<T>(obj: null | undefined, forwardOnlyNewReferences: boolean): null;
  transform<T>(obj: Observable<T>, forwardOnlyNewReferences: boolean): T;
  transform<T>(obj: Observable<T> | null | undefined, forwardOnlyNewReferences = true): T | null {
    this.forwardOnlyNewReferences$$.next(forwardOnlyNewReferences);

    this.observablesToSubscribe$$.next(!isObservable(obj) ? of(STATE_DEFAULT) : obj);
    return this.value;
  }
}
