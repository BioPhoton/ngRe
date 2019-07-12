import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {defer, from, fromEvent, interval, Observable, timer} from 'rxjs';
import {distinctUntilChanged, map, mergeAll, shareReplay, switchMap, withLatestFrom} from 'rxjs/operators';
import {LocalState} from '../../addons/state/local-state';
import {OptionsStateInterface} from './components/options-state.interface';
import {NgRxStoreService} from './services/ng-rx-store.service';

interface ButtonState {
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
    <div *ngIf="viewState$ | push as state">
      <pre>{{state | json}}</pre>
      <button
        *ngFor="let v of state.buttons | keyvalue"
        [id]="v.key"
        [style.fontWeight]="state.buttons[v.key] ? 'bold' : ''">
        {{v.key}}
      </button>
      <br>
      <button id="isNew">
        onlyNewRefs: {{state.isNew}}
      </button>
      <br>
      <app-options [state]="optionState$ | async">
      </app-options>
      <div *ngIf="state.buttons as buttons">
        <div *ngIf="buttons.async">
          async-pipe: {{primitiveInterval$ | async}}
        </div>
        <div *ngIf="buttons.primitive">
          primitiveInterval$ | push: {{primitiveInterval$ | push}}
        </div>
        <div *ngIf="buttons.mutable">
          mutableInterval$ | push: {{(mutableInterval$ | push)?.value}}
        </div>
        <div *ngIf="buttons.mutableArgs">
          mutableInterval$ | push:forwardOnlyNewRefs: {{(mutableInterval$ | push:isNew)?.value}}
        </div>
        <div *ngIf="buttons.immutable">
          immutableInterval$ | push: {{(immutableInterval$ | push)?.value}}
        </div>
        <div *ngIf="buttons.input">
          <h1 style="color: red">
            Why is it not passing the input boundary??
          </h1>
          <app-display
            [value]="primitiveInterval$ | push">
          </app-display>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalStateContainerComponent implements OnInit, AfterViewInit {
  // STATE
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
  localState = new LocalState<ViewState>(this.initState);

  // VIEW QUERIES
  viewState$: Observable<ViewState> = this.localState.state$;
  buttons$: Observable<any> = this.localState.state$
    .pipe(map(s => s.buttons as any));

  optionState$: Observable<OptionsStateInterface> = this.localState.state$
    .pipe(map(s => ({state: s.buttons, config: Object.keys(s.buttons)})));

  // state slices
  isNew$: Observable<boolean> = this.localState.state$
    .pipe(map(s => s.isNew));


  // COMMANDS
  // @TODO why defer here?
  isNewCommand$ = defer(() => fromEvent(document.getElementById('isNew'), 'click')
    .pipe(
      withLatestFrom(this.isNew$, (_, isNew) => isNew),
      map((isNew: boolean) => !isNew)
    )
  );
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

  // OBSERVABLE TESTS
  mutualData = {value: 0};
  primitiveInterval$ = timer(0, 100).pipe(shareReplay(1));
  mutableInterval$ = this.primitiveInterval$.pipe(
    map(value => {
      this.mutualData.value = value;
      return this.mutualData;
    })
  );
  immutableInterval$ = this.primitiveInterval$.pipe(
    map(value => ({value}))
  );

  constructor(private store: NgRxStoreService) {
    // state over ngRxStore
    this.localState
      .connectSlice({ngRxStore: this.store.storeState$});
  }

  ngOnInit() {
    // input binding state
    this.localState
      .connectSlice<string[]>({buttons: this.updateButtonStateCommand$});
    // component internal state
    this.localState
      .connectSlice({progress: interval(1000).pipe(map(v => 'prg' + v))});
  }

  ngAfterViewInit() {
    // state over UI
    this.localState
      .connectSlice({isNew: this.isNewCommand$});
  }

  getButtonClickAsId = (buttonsIds: string[]) => from(buttonsIds).pipe(
    map(id => fromEvent(document.getElementById(id), 'click')),
    mergeAll(),
    map(e => (e.target as any).id)
  );

}
