import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {Hook$} from 'ng-re';
import {Observable} from 'rxjs';
import {DummyService} from './dummy.service';

@Component({
  selector: 'app-service-life-cycle',
  template: `
    <h2>Service Life-Cycle Container</h2>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DummyService]
})
export class ServiceLifeCycleContainerComponent {

  constructor(private dS: DummyService) {}

}
