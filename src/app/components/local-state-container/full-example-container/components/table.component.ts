import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Input$} from '@ngx-re';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-table',
  template: `
    <ng-content></ng-content>
    <table>
      <thead>
      <th *ngFor="let heading of headings$ | push$">
        {{heading}}
      </th>
      </thead>
      <tbody *ngIf="headings$| push$ as headings">
      <tr [ngStyle]="{background: row.selected ? '#f00' : 'none'}"
        *ngFor="let row of state$ | push$">
        <td *ngFor="let key of headings">
          {{row[key]}}
        </td>
      </tr>
      </tbody>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
  @Input()
  state;
  @Input$('state')
  state$;

  headings$ = this.state$.pipe(
    map(a => a ? Object.keys(a[0]) : [])
  );

}
