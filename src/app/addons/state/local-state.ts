import {Injectable, OnDestroy} from '@angular/core';
import {ConnectableObservable, merge, Observable, Subject} from 'rxjs';
import {endWith, map, mergeAll, publishReplay, scan, tap} from 'rxjs/operators';
import {Hook$} from '../decorators/hook';

export class LocalStateService {

  @Hook$('onDestroy')
  onDestroy$;

  private commandObservable$$ = new Subject();
  private command$$ = new Subject();

  state$: Observable<any> =
    merge(
      this.command$$,
      this.commandObservable$$.pipe(tap(v => console.log('c$$: ', v)), mergeAll())
    )
      .pipe(
        scan((s, c) => {
          const [keyToDelete, value]: [string, any] = Object.entries(c)[0];
          const isKeyToDeletePresent = keyToDelete in s;

          if (!isKeyToDeletePresent && value === undefined) {
            console.log('The c$$ key you want to delete is not stored', c);
            return s;
          }

          if (value === undefined) {
            const {[keyToDelete]: v, ...newS} = s as any;
            return newS;
          }

          return ({...s, ...c});
        }, {}),
        publishReplay(1)
      );

  constructor() {
    // the local state service should be hot on instantiation
    (this.state$ as ConnectableObservable<any>).connect();

    this.onDestroy$.subscribe((_) => console.log('DESTROY'));
  }

  // This breaks the functional programming style for the user.
  // We should avoid such things. I recommend passing streams like with `connectSlice();`
  /** @deprecated This is invitation for imperative  client code */
  setSlice(command) {
    this.command$$.next(command);
  }

  // This should be the way to go. Functional style should be broken by the user.
  // Not like with `this.setSlice`
  connectSlice(config: { [key: string]: Observable<any> }): void {
    // @TODO validation / typing params
    const [slice, state$] = Object.entries(config)[0];
    const slice$ = state$.pipe(
      map(state => ({[slice]: state})),
      endWith({[slice]: undefined})
    );
    this.commandObservable$$.next(slice$);
  }
}
