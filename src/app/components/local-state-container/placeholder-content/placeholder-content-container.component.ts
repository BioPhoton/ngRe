import {ChangeDetectionStrategy, Component} from '@angular/core';
import {of, Subject} from 'rxjs';
import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-placeholder-content-container',
  template: `
    <p><b>Placeholder Content Container</b></p>
    <div *ngIf="httpData$ | async as data; else placeholder">
      from http request{{data | json}}
    </div>
    <ng-template #placeholder>
      <div class="spin" style="width: 100px">Placeholder Content Here</div>
    </ng-template>
    <hr>
    <ng-container *ngrxLet="httpData$ as data">
      {{data | json}}
      <div *ngIf="data">
        from http request{{data | json}}
      </div>
      <div class="spin" style="width: 100px" *ngIf="!data">
        Placeholder Content Here
      </div>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaceholderContentContainerComponent {

  httpData$ = of({name: 'test name'})
    .pipe(
      delay(3000)
    );

}
