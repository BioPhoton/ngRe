import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Input$} from '../../../../addons/input$-decorator/input$';
// import {Input$} from '../../../../addons/input$-decorator/input$';
import {OptionsState} from './options-state';

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
  @Input$<any>('state')
  state$;

  headings$ = this.state$.pipe(
    map(a => a ? Object.keys(a[0]) : [])
  );

}
