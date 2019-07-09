import {ChangeDetectorRef, OnDestroy, Pipe, PipeTransform, WrappedValue, ɵisObservable, ɵisPromise, ɵlooseIdentical} from '@angular/core';
import {from, isObservable, Observable, of, Subject} from 'rxjs';
import {distinctUntilChanged, map, switchAll, takeUntil, tap} from 'rxjs/operators';
// import {invalidPipeArgumentError} from './invalid_pipe_argument_error';

@Pipe({name: 'async', pure: false})
export class AsyncPipe implements OnDestroy, PipeTransform {
  private value: any = null;

  ngOnDestroy$$ = new Subject<boolean>();

  observablesToSubscribe$$ = new Subject<Observable<any>>();
  obs$ = this.observablesToSubscribe$$
    .pipe(distinctUntilChanged());

  handleIncomingObservables$ = this.obs$
    .pipe(
      distinctUntilChanged(ɵlooseIdentical),
      switchAll(),
      tap(v => this.value = v),
      tap(_ => this.ref.markForCheck())
    );

  constructor(private ref: ChangeDetectorRef) {
    this.handleIncomingObservables$
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

    if (ɵisObservable(obj) || ɵisPromise(obj)) {
      obj = from(obj);
    } else {
      throw new Error('invalidPipeArgumentError'); // invalidPipeArgumentError(AsyncPipe, obj);
    }

    this.observablesToSubscribe$$.next(!isObservable(obj) ? of(null) : obj);
    return WrappedValue.wrap(this.value);
  }

}
