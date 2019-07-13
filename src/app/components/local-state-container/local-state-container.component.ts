import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {defer, fromEvent, Observable, Subject} from 'rxjs';
import {map, withLatestFrom} from 'rxjs/operators';
import {selectSlice} from '../../addons/rxjs/operators/selectSlice';
import {LocalStateService} from '../../addons/state/local-state';

interface ButtonState {
  [key: string]: boolean;

  async: boolean;
  primitive: boolean;
  mutable: boolean;
  mutableArgs: boolean;
  immutable: boolean;
  input: boolean;
}

interface ViewState {
  ngRxStore: string;
  progress: string;
  isNew: boolean;
  buttons: ButtonState;
}

@Component({
  selector: 'app-local-state-container',
  template: `
    <button (click)="isNewClick$$.next($event)">
      onlyNewRefs
    </button>
    <!--
    <div *ngIf="viewState$ | push as state">
      <pre>{{state | json}}</pre>
      <button
        *ngFor="let v of state.buttons | keyvalue"
        [id]="v.key"
        [style.fontWeight]="state.buttons[v.key] ? 'bold' : ''">
        {{v.key}}
      </button>
      <br>
      <hr/>
      <app-options [state]="optionState$ | async">
      </app-options>

      <app-pipe-tests-panel [state]="buttons$ | async">
      </app-pipe-tests-panel>
    </div>-->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    LocalStateService
  ]
})
export class LocalStateContainerComponent implements OnInit, AfterViewInit {
  // VIEW Bindings
  isNewClick$$ = new Subject();

  // STATE
  /**/
  initState: ViewState = {
    // global state
    ngRxStore: '',
    // component internal state
    progress: '',
    // view state
    isNew: false,
    buttons: {
      async: false,
      primitive: false,
      mutable: false,
      mutableArgs: false,
      immutable: false,
      input: false
    }
  };

  // VIEW QUERIES
  // viewState$: Observable<ViewState> = this.localState.state$;

  /*
  buttons$ = this.localState.state$
    .pipe(map((s: ViewState) => s.buttons));

  optionState$ = this.localState.state$
    .pipe(
      map((s: ViewState): OptionsState => ({
        state: s.buttons,
        config: Object.keys(s.buttons) as string[]
      }))
    );
 */
  // state slices
  isNew$: Observable<boolean> = this.localState.state$
    .pipe(selectSlice(s => s.isNew));

  // COMMANDS
  // @TODO why defer here?
  isNewCommand$ = this.isNewClick$$
    .pipe(
      withLatestFrom(this.isNew$, (_, isNew) => isNew),
      map((isNew: boolean) => !isNew)
    );

  /*
  buttonIdClicks$ = this.buttons$.pipe(
    distinctUntilChanged(),
    switchMap(buttonState => this.getButtonClickAsId(Object.keys(buttonState)))
  );

  updateButtonStateCommand$: any = this.buttonIdClicks$
    .pipe(
      withLatestFrom(
        this.buttons$,
        (id: string, buttons) => ({...buttons, [id]: !buttons[id]})
      )
    );
*/
  constructor(private localState: LocalStateService/*private store: NgRxStoreService*/) {
    this.localState.setSlice(this.initState);
    // state over ngRxStore
    /*
    this.localState
      .connectSlice({ngRxStore: this.store.storeState$});
    */

    this.isNewCommand$.subscribe(console.log);
  }

  ngOnInit() {
    /*
    // input binding state
    this.localState
      .connectSlice<string[]>({buttons: this.updateButtonStateCommand$});
    // component internal state
    this.localState
      .connectSlice({progress: interval(1000).pipe(map(v => 'prg' + v))});
  */
  }

  ngAfterViewInit() {
    // state over UI
    /*
    this.localState
      .connectSlice({isNew: this.isNewCommand$});
      */
  }

  /*
    getButtonClickAsId = (buttonsIds: string[]) => from(buttonsIds).pipe(
      map(id => fromEvent(document.getElementById(id), 'click')),
      mergeAll(),
      map(e => (e.target as any).id)
    );
  */

}
