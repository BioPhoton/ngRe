import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {OptionsState} from './options-state';

@Component({
  selector: 'app-table',
  template: `
    <ng-content></ng-content>
    <table>
      <thead *ngIf="headings$ | push$ as headings">
      <th *ngFor="let heading of headings">
        {{heading}}
      </th>
      </thead>
      <tbody>
      <tr [ngStyle]="{background: row.selected ? '#f00' : 'none'}"
        *ngFor="let row of state$$ | async">
        <td *ngFor="let col of row | keyvalue">
          {{col.value}}
        </td>
      </tr>
      </tbody>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {

  state$$ = new ReplaySubject<OptionsState>(1);

  @Input()
  set state(state: OptionsState) {
    this.state$$.next(state);
  }

  headings$ = this.state$$.pipe(
    map(a => a ? Object.keys(a[0]) : null)
  );
}
