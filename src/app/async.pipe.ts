/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  ChangeDetectorRef,
  Injectable,
  OnDestroy,
  Pipe,
  PipeTransform,
  WrappedValue,
  ɵisObservable,
  ɵisPromise,
  ɵlooseIdentical
} from '@angular/core';
import { from, isObservable, Observable, of, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  switchAll,
  takeUntil,
  tap
} from 'rxjs/operators';
import { invalidPipeArgumentError } from './invalid_pipe_argument_error';

/**
 * @ngModule CommonModule
 * @description
 *
 * Unwraps a value from an asynchronous primitive.
 *
 * The `async` pipe subscribes to an `Observable` or `Promise` and returns the latest value it has
 * emitted. When a new value is emitted, the `async` pipe marks the component to be checked for
 * changes. When the component gets destroyed, the `async` pipe unsubscribes automatically to avoid
 * potential memory leaks.
 *
 * @usageNotes
 *
 * ### Examples
 *
 * This example binds a `Promise` to the view. Clicking the `Resolve` button resolves the
 * promise.
 *
 * {@example common/pipes/ts/async_pipe.ts region='AsyncPipePromise'}
 *
 * It's also possible to use `async` with Observables. The example below binds the `time` Observable
 * to the view. The Observable continuously updates the view with the current time.
 *
 * {@example common/pipes/ts/async_pipe.ts region='AsyncPipeObservable'}
 *
 * @publicApi
 */
@Injectable()
@Pipe({ name: 'async$', pure: false })
export class AsyncPipe implements OnDestroy, PipeTransform {

  private ngOnDestroy$$ = new Subject();

  private _latestValue: any = null;

  private pipedValue$$ = new Subject();
  pipedValue$ = this.pipedValue$$
    .pipe(
      map(obj => {
        if (ɵisPromise(obj) || ɵisObservable(obj)) {
          return from(obj);
        }

        throw invalidPipeArgumentError(AsyncPipe, obj);
      }),
      // only forward new references (avoids holding a local reference to the previous observable => this.currentObs !== obs)
      distinctUntilChanged(),
      // trigger change detection for new observables bound in the template
      tap(_ => this._ref.markForCheck())
    );

  handlePipedValues$ = this.pipedValue$
    .pipe(
      // unsubscribe from previous observables
      // then flatten the latest internal observables into the output
      switchAll(),

      // JS has NaN !== NaN
      distinctUntilChanged(ɵlooseIdentical),

      // assign value that will get returned from the transform function on the next change detection
      // trigger change detection for the to get the newly assigned value rendered
      tap((value) => {
        this._latestValue = value;
        this._ref.markForCheck();
      })
    );

  constructor(private _ref: ChangeDetectorRef) {
    this.handlePipedValues$
      .pipe(takeUntil(this.ngOnDestroy$$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$$.next(true);
  }

  transform<T>(obj: null): null;
  transform<T>(obj: undefined): undefined;
  transform<T>(obj: Observable<T> | null | undefined): T | null;
  transform<T>(obj: Promise<T> | null | undefined): T | null;
  transform(obj: Observable<any> | Promise<any> | null | undefined): any {
    this.pipedValue$$.next(!isObservable(obj) ? of(null) : obj);
    return WrappedValue.wrap(this._latestValue);
  }

}
