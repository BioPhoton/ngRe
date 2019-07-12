import {merge, Observable, Subject} from 'rxjs';
import {map, mergeAll, scan, shareReplay, startWith} from 'rxjs/operators';

export class LocalState<T> {

  private commandObservable$$ = new Subject();
  private command$$ = new Subject();

  state$: Observable<T> =
    merge(
      this.command$$,
      this.commandObservable$$.pipe(mergeAll())
    )
      .pipe(
        startWith(this.initState),
        scan((s, c) => ({...s, ...c})),
        shareReplay(1)
      );

  constructor(private initState) {

  }

  // This breaks the functional programming style for the user.
  // We should avoid such things. I recommend passing streams like with `connectSlice();`
  setSlice(command) {
    this.command$$
      .next(command);
  }

  // This should be the way to go. Functional style should be broken by the user.
  // Not like with `this.setSlice`
  connectSlice<I>(config: {[key: string]: Observable<I>}): void {
    const {slice, command$}  = Object(config).entries();
    const slice$ = command$.pipe(map(state => ({[slice]: state})));
    this.commandObservable$$
      .next(slice$);
  }
}
