import {ChangeDetectorRef, OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {isObservable, Observable, of, Subject} from 'rxjs';
import {distinctUntilChanged, switchAll, takeUntil} from 'rxjs/operators';

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
@Pipe({name: 'push'})
export class PushPipe implements PipeTransform, OnDestroy {
  private value: any = null;

  ngOnDestroy$$ = new Subject<boolean>();

  // @TODO fix any types
  observablesToSubscribe$$ = new Subject<Observable<any>>();
  observablesToSubscribe$ = this.observablesToSubscribe$$
    .pipe(
      // only forward new references (avoids holding a local reference to the previous observable => this.currentObs !== obs)
      distinctUntilChanged()
    );

  handleChangesSideEffect$ = this.observablesToSubscribe$
    .pipe(
      // unsubscribe from previous observables
      // then flatten the latest internal observables into the output
      switchAll()
    );

  constructor(private cdRef: ChangeDetectorRef) {
    this.handleChangesSideEffect$
    // unsubscribe if component gets destroyed
      .pipe(takeUntil(this.ngOnDestroy$$))
      .subscribe(value => {
        // assign value that will get returned from the transform function on the next change detection
        this.value = value;
        // trigger change detection for the to get the newly assigned value rendered
        this.cdRef.detectChanges();
      });
  }

  // @TODO Minor improvement: Use observable lifecycle hooks over decorators
  ngOnDestroy(): void {
    this.ngOnDestroy$$.next(true);
  }

  transform<T>(obs: null | undefined, forwardOnlyNewReferences: boolean): null;
  transform<T>(obs: Observable<T>, forwardOnlyNewReferences: boolean): T;
  transform<T>(obs: Observable<T> | null | undefined, forwardOnlyNewReferences = true): T | null {
    console.log('');
    this.observablesToSubscribe$$.next(!isObservable(obs) ? of(null) : obs);
    return this.value;
  }
}
