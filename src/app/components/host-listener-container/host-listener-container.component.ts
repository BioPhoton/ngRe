import {ChangeDetectionStrategy, Component} from '@angular/core';
import {interval} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-host-listener-container',
  template: `
    <h1>Input container component</h1>
    <app-host-listener>
    </app-host-listener>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostListenerContainerComponent {

}
