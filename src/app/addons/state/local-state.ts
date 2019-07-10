import {merge, Observable, Subject} from 'rxjs';
import {map, mergeAll, scan, shareReplay, startWith, tap} from 'rxjs/operators';

export class LocalState<T> {

  private viewCommandObservable$ = new Subject();
  private viewCommand$$ = new Subject();
  private viewCommand$: Observable<any> = this.viewCommand$$.asObservable();
  state$: Observable<T> =
    merge(
      this.viewCommand$,
      this.viewCommandObservable$.pipe(mergeAll())
    )
    .pipe(
      startWith(this.initState),
      scan((s, c) => ({...s, ...c})),
      shareReplay(1)
    );

  constructor(private initState) {

  }

  bindSlice(command) {
    this.viewCommand$$.next(command);
  }

  observeSlice(slice: string, command$: Observable<any>) {
    const slice$ = command$.pipe(map(state => ({[slice]: state})));
    this.viewCommandObservable$
      .next(slice$);
  }
}
