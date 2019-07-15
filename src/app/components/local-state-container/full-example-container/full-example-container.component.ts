import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {LocalStateService} from '../../../addons/local-state$-service/local-state';
import {getRandomAttendees} from './random';

@Component({
  selector: 'app-full-example-container',
  template: `
    <h1>Full Example Local State Management</h1>
    <div style="width:100%">
      <button
        (click)="updateSelectedAttendees$.next()">
        update selected attendees
      </button>
    </div>
    <app-table
      style="float: left; width:45%"
      [state]="selectedAttendees$ | push$">
      <h2>Selected Attendees</h2>
    </app-table>
    <app-local-state-container
      style="float: left; width:45%"
      [selectedAttendeesIds]="selectedAttendeesIds$ | async">
    </app-local-state-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    LocalStateService
  ]
})
export class FullExampleContainerComponent {
  updateSelectedAttendees$ = new Subject();

  selectedAttendees$ = this.updateSelectedAttendees$
    .pipe(map(_ => getRandomAttendees(4)));

  selectedAttendeesIds$ = this.selectedAttendees$
    .pipe(map(a => a.map(i => i.id)));

}
