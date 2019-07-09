import {AfterViewInit, ChangeDetectionStrategy, Component} from '@angular/core';
import {Observable, Subject, timer} from 'rxjs';
import {map, scan, shareReplay, startWith, withLatestFrom} from 'rxjs/operators';

interface ViewState {
  isNew: boolean;
  buttons: {
    async: boolean,
    primitive: boolean,
    mutable: boolean,
    mutableArgs: boolean,
    immutable: boolean,
    input: boolean
  };
}


@Component({
  selector: 'app-push-pipe',
  template: `
    <div *ngIf="viewState$ | push as state">
      <pre>{{state | json}}</pre>
      <button
        *ngFor="let v of state.buttons | keyvalue"
        [id]="v.key"
        (click)="buttonIdClicks$$.next(v.key)"
        [style.fontWeight]="state.buttons[v.key] ? 'bold' : ''">
        {{v.key}}
      </button>
      <br>
      <!-- <button (click)="viewCommand$$.isNew">
         onlyNewRefs: {{isNew}}
       </button>
       -->
      <br>
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
export class PushPipeContainerComponent implements AfterViewInit {
  mutualData = {value: 0};
  initState: ViewState = {
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

  viewCommand$$ = new Subject();
  viewCommand$: Observable<any> = this.viewCommand$$.asObservable();
  viewState$: Observable<ViewState> = this.viewCommand$
    .pipe(
      startWith(this.initState),
      scan((s, c) => ({...s, ...c})),
      shareReplay(1)
    );

  buttonIdClicks$$ = new Subject();
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

  constructor() {
  }

  ngAfterViewInit() {
    this.buttonIdClicks$$
      .pipe(
        withLatestFrom(
          this.viewState$,
          (id: string, state) => ({
            ...state,
            buttons: {
              ...state.buttons,
              [id]: !state.buttons[id]
            }
          })
        )
      )
      .subscribe(v => this.viewCommand$$.next(v));

  }

}
