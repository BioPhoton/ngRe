import {Injectable} from '@angular/core';
import {ConnectableObservable, interval} from 'rxjs';
import {multicast, publish, share, timeInterval} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class TickService {
  tick$ = interval(600)
    .pipe(timeInterval(), share());

  constructor() {
    console.log('TickService CTOR');
  }

}
