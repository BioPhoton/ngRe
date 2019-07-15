import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {combineLatest, Observable, pipe, ReplaySubject, Subject} from 'rxjs';
import {map, tap, withLatestFrom} from 'rxjs/operators';
import {LocalStateService} from '../../../addons/local-state$-service/local-state';
import {selectSlice} from '../../../addons/local-state$-service/operators/selectSlice';
import {LocalStateComponentFacade} from './services/local-state-component.facade';

@Component({
  selector: 'app-local-state-container',
  template: `
    <h2>Manage Attendees</h2>
    <button (click)="showAllClick$$.next($event)">
      {{(showAllSlice$ | push$) ? 'Show All' : 'Hide Some'}}
    </button>
    {{filtersSlice$ | push$ | json}}
    <br>
    <app-options
      [state]="optionComponentState$ | push$"
      (stateChange)="filtersComponentStateChange$$.next($event)">
      <h3>Hide entries with properties false</h3>
    </app-options>
    <app-table
      [state]="attendeesWithSelectionFiltered$ | push$">
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
  selectedAttendeesIds$ = new ReplaySubject(1);

  @Input()
  set selectedAttendeesIds(v) {
    this.selectedAttendeesIds$.next(v);
  }

  // GLOBAL STATE MANAGEMENT
  // State from ngRx store derived over a selector
  // attendeesWithCity$ = this.ngRxFacade.attendeesWithCity$;

  // VIEW EVENTS
  showAllClick$$ = new Subject();
  filtersComponentStateChange$$ = new Subject();

  // STATE ==========================
  // STATE SLICES
  filtersSlice$ = this.localState.state$
    .pipe(selectSlice(s => s.filters));
  showAllSlice$: Observable<boolean> = this.localState.state$
    .pipe(selectSlice(s => s.showAll));
  attendeesWithSelectionFiltered$: Observable<boolean> = this.localState.state$
    .pipe(
      selectSlice(s => s.attendeesWithSelectionFiltered),
      tap(v => console.log('attendeesWithSelectionFiltered$', v ? v.length : v))
    );

  // RENDERED STATE
  optionComponentState$ = this.filtersSlice$
    .pipe(
      map(s => ({
        state: s,
        config: Object.keys(s)
      }))
    );

  // COMMANDS =================================
  showAllCommand$ = this.showAllClick$$
    .pipe(
      withLatestFrom(this.showAllSlice$, (_, isNew) => isNew),
      // toggle showAll state
      map((isNew: boolean) => !isNew)
    );
  attendeesWithSelectionFilteredCommands$ = combineLatest(
    this.ngRxFacade.attendeesWithCity$,
    this.selectedAttendeesIds$,
    this.filtersSlice$
  )
    .pipe(
      this.mapToAttendeesWithSelectionFiltered()
    );

  constructor(
    private localState: LocalStateService,
    public ngRxFacade: LocalStateComponentFacade
  ) {
    this.localState.setSlice({
      filters: {
        paymentDone: false,
        specialMember: false
      }
    });

    this.localState.connectSlice({showAll: this.showAllCommand$});
    this.localState.connectSlice({filters: this.filtersComponentStateChange$$});
    this.localState.connectSlice({attendeesWithSelectionFiltered: this.attendeesWithSelectionFilteredCommands$});
  }

  mapToAttendeesWithSelectionFiltered() {
    return pipe(
      map(([all, ids, filters]) => {
        if (all === null || ids === null) {
          return null;
        }

        let withSelectedState = all
          .map(a => ({...a, selected: ids.includes(a.id)}));

        const filterKeysSet = Object.keys(filters).filter(filterProp => filters[filterProp] === true);
        if (filterKeysSet.length) {
          withSelectedState = withSelectedState.filter(
            i => {
              const isItemPropFalse = filterKeysSet.some(filterProp => i[filterProp] === false);
              return !isItemPropFalse;
            }
          );
        }
        console.log('filterKeysSet', filterKeysSet);
        console.log('filteredWithSelectedState', withSelectedState.length);
        return withSelectedState;
      })
    );
  }

}
