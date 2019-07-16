import {Injectable, OnDestroy} from '@angular/core';
import {combineLatest, Subject} from 'rxjs';
import {map, mergeAll, takeUntil} from 'rxjs/operators';
import {Hook$} from '../../../../addons/hook$-decorator/hook';
import {selectSlice} from '../../../../addons/local-state$-service/operators/selectSlice';
import {NgRxStoreService} from './ng-rx-store.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStateComponentFacade {

  @Hook$('onDestroy')
  onDestroy$;

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
        return (attendees as any[])
          .map(a => {
            const city = (cities as any[]).find(c => c.id === a.cid);
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

  triggerUpdateAttendees$ = new Subject();

  constructor(private ngRxStore: NgRxStoreService) {
    this.triggerUpdateAttendees$
      .pipe(
        mergeAll(),
        takeUntil(this.onDestroy$)
      )
      .subscribe(_ => this.ngRxStore.updateAttendees());
  }

  connectUpdateAttendees$(t) {
    this.triggerUpdateAttendees$.next(t);
  }

}
