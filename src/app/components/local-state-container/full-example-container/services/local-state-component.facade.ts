import {Injectable} from '@angular/core';
import {combineLatest, merge, Subject} from 'rxjs';
import {filter, map, mergeAll, takeUntil, tap} from 'rxjs/operators';
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
    this.attendees$.pipe(filter(v => !!v)),
    this.cities$.pipe(filter(v => !!v))
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
  triggerUpdateCities$ = new Subject();

  constructor(private ngRxStore: NgRxStoreService) {
    merge(
      this.triggerUpdateAttendees$.pipe(mergeAll(), tap(_ => this.ngRxStore.updateAttendees())),
      this.triggerUpdateCities$.pipe(mergeAll(), tap(_ => this.ngRxStore.updateCities())),
    ).pipe(
      takeUntil(this.onDestroy$)
    )
      .subscribe();
  }

  connectUpdateAttendees$(t) {
    this.triggerUpdateAttendees$.next(t);
  }

  connectUpdateCities$(t) {
    this.triggerUpdateCities$.next(t);
  }

}
