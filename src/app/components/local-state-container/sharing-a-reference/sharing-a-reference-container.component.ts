import {ChangeDetectionStrategy, Component} from '@angular/core';
import {of, Subject} from 'rxjs';

@Component({
  selector: 'app-sharing-a-reference-container',
  template: `
    <p><b>formGroupModel$:</b></p>
    <pre>{{formGroupModel$ | async | json}}</pre>
    <p><b>formValue$:</b></p>
    <pre>{{formValue$ | async | json}}</pre>
    <app-sharing-a-reference
      [formGroupModel]="formGroupModel$ | async"
      (formValueChange)="formValue$.next($event)">
    </app-sharing-a-reference>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharingAReferenceContainerComponent {

  formValue$ = new Subject();

  formGroupModel$ = of({
    name: '',
    age: 0
  });

}
