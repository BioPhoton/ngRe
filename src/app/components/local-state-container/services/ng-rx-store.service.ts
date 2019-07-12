import { Injectable } from '@angular/core';
import {interval} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NgRxStoreService {

  storeState$ = interval(2000).pipe(map(v => 'NgRxStore: ' + v));

  constructor() { }
}
