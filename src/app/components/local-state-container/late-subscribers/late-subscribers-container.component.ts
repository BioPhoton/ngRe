import {ChangeDetectionStrategy, Component} from '@angular/core';
import {interval} from 'rxjs';
import {take} from 'rxjs/operators';
import {selectSlice} from '../../../addons/local-state$-service/operators/selectSlice';
import {LocalStateService} from '../../../addons/local-state$-service/local-state';

@Component({
  selector: 'app-late-subscribers-container',
  template: `
    <button (click)="setNum()">setNum</button>
    <button (click)="deleteNum()">deleteNum</button>
    <button (click)="setRandomState()">setRandomState</button>
    <pre>state$: {{localState.state$ | push$ | json}}</pre>
    <pre>num$: {{num$ | push$ | json}}</pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    LocalStateService
  ]
})
export class LateSubscribersContainerComponent {

  num$ = this.localState.state$
    .pipe(selectSlice(s => s.num));

  constructor(public localState: LocalStateService) {
    // this.localState.connectSlice({num: interval(1000)});
  }

  setNum() {
    this.localState.setSlice({num: 3});
  }

  deleteNum() {
    this.localState.setSlice({num: undefined});
  }

  setRandomState() {
    this.localState
      .connectSlice({['num' + Math.random()]: interval(500).pipe(take(10))});
  }

}
