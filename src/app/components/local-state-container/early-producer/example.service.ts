import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {scan, shareReplay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocalStateService {
  private command = new ReplaySubject(1);
  state$ = this.command.asObservable()
    .pipe(scan((a, c) => ({...a, ...c}), {}),
      // shareReplay(1)
    );

  constructor() {
    this.state$.subscribe(console.log);
  }

  set(command) {
    this.command.next(command);
  }
}
