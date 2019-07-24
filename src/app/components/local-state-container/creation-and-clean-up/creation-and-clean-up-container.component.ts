import {ChangeDetectionStrategy, Component} from '@angular/core';
import {LocalStateService, selectSlice} from 'ng-re';
import {interval} from 'rxjs';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-creation-and-clean-up-container',
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
export class CreationAndCleanUpContainerComponent {

  num$ = this.localState.state$
    .pipe(selectSlice(s => s.num));

  constructor(public localState: LocalStateService) {
    this.localState.setSlices({num: 777});
  }

  setNum() {
    this.localState.setSlices({num: 3});
  }

  deleteNum() {
    this.localState.setSlices({num: undefined});
  }

  setRandomState() {
    this.localState
      .connectSlices({['num' + Math.random()]: interval(500).pipe(take(10))});
  }

}
