import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {combineLatest, Subject} from 'rxjs';
import {map, startWith, withLatestFrom} from 'rxjs/operators';
import {Input$, LocalStateService, selectSlice} from '@ngx-re';
import {mapToAttendeesWithSelectionFiltered} from './map-to-Attendees-with-selection-filtered';
import {LocalStateComponentFacade} from './services/local-state-component.facade';

@Component({
  selector: 'app-child-local-state-container',
  template: `
    <h2>Manage Attendees</h2>
    <button (click)="refreshAttendeesClick$$.next($event)">
      Refresh Attendees
    </button>
    <button (click)="refreshCitiesClick$$.next($event)">
      Refresh Cities
    </button>
    <button
      style="float: left; margin-right: 10px;"
      (click)="showAllClick$$.next($event)">
      {{(showAllSlice$ | async) ? 'First 10' : 'Show All'}}
    </button>

    <app-options *ngIf="optionComponentState$ | async as optionComponentState"
      [state]="optionComponentState"
      (stateChange)="filtersComponentStateChange$$.next($event)">
      <h3>Hide entries with properties false</h3>
    </app-options>

    <app-table
      [state]="attendeesWithSelectionFiltered$ | async">
      <h3>Filtered and joined attendees</h3>
    </app-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LocalStateService
  ]
})
export class ChildLocalStateContainerComponent {
  // INCOMING ==========================
  // INPUT DATA

  @Input()
  selectedAttendeesIds;
  @Input$('selectedAttendeesIds')
  selectedAttendeesIdsFromInput$;

  // VIEW EVENTS
  showAllClick$$ = new Subject();
  refreshAttendeesClick$$ = new Subject();
  refreshCitiesClick$$ = new Subject();
  filtersComponentStateChange$$ = new Subject();

  // STATE ==========================
  // STATE SLICES
  filtersSlice$ = this.localState.state$.pipe(selectSlice(s => s.filters));
  showAllSlice$ = this.localState.state$.pipe(selectSlice(s => s.showAll));
  attendeesWithCitySlice$ = this.localState.state$.pipe(selectSlice(s => s.attendeesWithCity));
  selectedAttendeesIdsSlice$ = this.localState.state$.pipe(selectSlice(s => s.selectedAttendeesIds));

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
      mapToAttendeesWithSelectionFiltered()
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
    this.ngRxFacade.connectUpdateAttendees$(this.refreshAttendeesClick$$);
    this.ngRxFacade.connectUpdateCities$(this.refreshCitiesClick$$);

    this.localState.setSlices({filters: {paymentDone: false, specialMember: false}});
    this.localState.connectSlices(
      {
        filters: this.filtersComponentStateChange$$,
        showAll: this.showAllCommand$,
        attendeesWithCity: this.ngRxFacade.attendeesWithCity$,
        selectedAttendeesIds: this.selectedAttendeesIdsFromInput$
      });
  }

}
