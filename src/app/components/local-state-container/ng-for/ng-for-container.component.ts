import {ChangeDetectionStrategy, Component} from '@angular/core';
import {LocalStateService, selectSlice} from 'ng-re';

@Component({
  selector: 'app-ng-for-container',
  template: `
    <h2>ngFor Container</h2>
    <div>
      <button
        *ngFor="let i of buttons$ | async"
        (click)="command.next(i)">
        Button 1
      </button>
    </div>
    <pre>{{v | async | json}}</pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LocalStateService]
})
export class NgForContainerComponent {

  buttons$ = this.localState.state$.pipe(selectSlice(s => s.buttons));

  constructor(private localState: LocalStateService) {
    this.localState.setSlices({
      buttons: [1, 2, 3, 4, 5]
    });
  }

}
