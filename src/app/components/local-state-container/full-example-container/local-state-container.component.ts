import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {combineLatest, pipe, ReplaySubject, Subject} from 'rxjs';
import {map, startWith, withLatestFrom} from 'rxjs/operators';
import {LocalStateService} from '../../../addons/local-state$-service/local-state';
import {selectSlice} from '../../../addons/local-state$-service/operators/selectSlice';
import {LocalStateComponentFacade} from './services/local-state-component.facade';

@Component({
  selector: 'app-local-state-container',
  template: `
    <h2>Manage Attendees</h2>
    <button (click)="refresh$$.next($event)">
      refresh
    </button>
    <app-options *ngIf="optionComponentState$ | push$ as optionComponentState"
      [state]="optionComponentState"
      (stateChange)="filtersComponentStateChange$$.next($event)">

      <h3>Hide entries with properties false</h3>

      <button
        style="float: left; margin-right: 10px;"
        (click)="showAllClick$$.next($event)">
        {{(showAllSlice$ | push$) ? 'First 10' : 'Show All'}}
      </button>

    </app-options>

    <app-table
      [state]="attendeesWithSelectionFiltered$ | push$">
      <h3>Filtered and joined attendees</h3>
    </app-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    LocalStateService
  ]
})
export class LocalStateContainerComponent {
  // INCOMING ==========================
  // INPUT DATA
  selectedAttendeesIdsFromInput$ = new ReplaySubject(1);
  @Input()
  set selectedAttendeesIds(v) {
    this.selectedAttendeesIdsFromInput$.next(v);
  }

  // VIEW EVENTS
  showAllClick$$ = new Subject();
  refresh$$ = new Subject();
  filtersComponentStateChange$$ = new Subject();

  // STATE ==========================
  // STATE SLICES
  filtersSlice$ = this.localState.state$
    .pipe(selectSlice(s => s.filters));
  showAllSlice$ = this.localState.state$
    .pipe(selectSlice(s => s.showAll));
  attendeesWithCitySlice$ = this.localState.state$
    .pipe(selectSlice(s => s.attendeesWithCity));
  selectedAttendeesIdsSlice$ = this.localState.state$
    .pipe(selectSlice(s => s.selectedAttendeesIds));

  // RENDERED STATE
  optionComponentState$ = this.filtersSlice$
    .pipe(
      map(s => (!s ? null : {state: s, config: Object.keys(s)}))
    );
  attendeesWithSelectionFiltered$ = combineLatest(
    this.attendeesWithCitySlice$,
    this.selectedAttendeesIdsSlice$.pipe(map(v => v ? v : [])),
    this.showAllSlice$.pipe(startWith(true)),
    this.filtersSlice$
  )
    .pipe(
      this.mapToAttendeesWithSelectionFiltered()
    );


  // COMMANDS =================================
  showAllCommand$ = this.showAllClick$$
    .pipe(
      withLatestFrom(this.showAllSlice$, (_, isNew) => isNew),
      // toggle showAll state
      map((isNew: boolean) => !isNew)
    );

  constructor(
    private localState: LocalStateService,
    public ngRxFacade: LocalStateComponentFacade
  ) {
    this.ngRxFacade.connectUpdateAttendees$(this.refresh$$);

    this.localState.setSlice({filters: {paymentDone: false, specialMember: false}});
    this.localState.connectSlice({filters: this.filtersComponentStateChange$$});
    this.localState.connectSlice({showAll: this.showAllCommand$});
    this.localState.connectSlice({attendeesWithCity: this.ngRxFacade.attendeesWithCity$});
    this.localState.connectSlice({selectedAttendeesIds: this.selectedAttendeesIdsFromInput$});
  }

  mapToAttendeesWithSelectionFiltered() {
    return pipe(
      map(([all, ids, showAll, filters]) => {

        if (!(all && ids)) {
          return undefined;
        }

        let withSelectedState = all
          .map(a => ({...a, selected: ids.includes(a.id)}));

        const filterKeysSet = Object.keys(filters)
          .filter(filterProp => filters[filterProp] === true);

        if (filterKeysSet.length) {
          withSelectedState = withSelectedState.filter(
            i => {
              const isItemPropFalse = filterKeysSet
                .some(filterProp => i[filterProp] === false);
              return !isItemPropFalse;
            }
          );
        }

        const visibleItems = showAll ? withSelectedState : withSelectedState.slice(0, 10);

        return visibleItems;
      })
    );
  }

}
