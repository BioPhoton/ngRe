import {Injectable} from '@angular/core';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {selectSlice} from '../../../../addons/local-state$-service/operators/selectSlice';
import {NgRxStoreService} from './ng-rx-store.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStateComponentFacade {

  cities$ = this.ngRxStore.storeState$
    .pipe(selectSlice(s => s.cities));
  attendees$ = this.ngRxStore.storeState$
    .pipe(selectSlice(s => s.attendees));

  attendeesWithCity$ = combineLatest(
    this.attendees$,
    this.cities$
  )
    .pipe(
      map(([attendees, cities]) => {
        return attendees
          .map(a => {
            const city = cities.find(c => c.id === a.cid);
            // remove cid property;
            const {cid, ...withoutCityId} = a;
            return {
              ...withoutCityId,
              city: city ? city.name : 'none',
              paymentDone: Math.random() < 0.5
            };
          });
      })
    );

  constructor(private ngRxStore: NgRxStoreService) {
  }

}
