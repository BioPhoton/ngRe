import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {scan, share, shareReplay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocalStateService {
  private command = new ReplaySubject(1);
  state$ = this.command.asObservable()
    .pipe(
      scan((a, c) => ({...a, ...c}), {}),
      shareReplay()
    );

  constructor() {
  }

  set(command) {
    this.command.next(command);
  }
}
