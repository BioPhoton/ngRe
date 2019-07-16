import {Injectable} from '@angular/core';
import {ConnectableObservable, merge, Observable, Subject} from 'rxjs';
import {endWith, map, mergeAll, publishReplay, scan, takeUntil, tap} from 'rxjs/operators';
import {Hook$} from '../hook$-decorator/hook';

@Injectable()
export class LocalStateService {

  @Hook$('onDestroy')
  onDestroy$;

  private commandObservable$$ = new Subject();
  private command$$ = new Subject();
  state$: Observable<any> =
    merge(
      this.command$$,
      this.commandObservable$$.pipe(mergeAll())
    )
      .pipe(
        scan((s, c) => {
          const [keyToDelete, value]: [string, any] = Object.entries(c)[0];
          const isKeyToDeletePresent = keyToDelete in s;
          // The key you want to delete is not stored :)
          if (!isKeyToDeletePresent && value === undefined) {
            return s;
          }
          // Delete slice
          if (value === undefined) {
            const {[keyToDelete]: v, ...newS} = s as any;
            return newS;
          }
          // update state
          return ({...s, ...c});
        }, {}),
        takeUntil(this.onDestroy$),
        publishReplay(1)
      );

  constructor() {
    // the local state service should be hot on instantiation
    (this.state$ as ConnectableObservable<any>).connect();
  }

  // This breaks the functional programming style for the user.
  // We should avoid such things. It's recommended passing streams like with `connectSlice();`
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
      tap(_ => console.log('update slice', slice)),
      endWith({[slice]: undefined})
    );
    this.commandObservable$$.next(slice$);
  }

}
