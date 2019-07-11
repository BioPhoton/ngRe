import {merge, Observable, Subject} from 'rxjs';
import {map, mergeAll, scan, shareReplay, startWith} from 'rxjs/operators';

export class LocalState<T> {

  private commandObservable$ = new Subject();

  private command$$ = new Subject();
  private command$: Observable<any> = this.command$$.asObservable();

  state$: Observable<T> =
    merge(
      this.command$,
      this.commandObservable$.pipe(mergeAll())
    )
      .pipe(
        startWith(this.initState),
        scan((s, c) => ({...s, ...c})),
        shareReplay(1)
      );

  constructor(private initState) {

  }

  setSlice(command) {
    this.command$$.next(command);
  }

  connectSlice(slice: string, command$: Observable<any>): void {
    const slice$ = command$.pipe(map(state => ({[slice]: state})));
    this.commandObservable$
      .next(slice$);
  }
}
