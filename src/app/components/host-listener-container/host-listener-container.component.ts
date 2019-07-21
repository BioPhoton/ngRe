import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-host-listener-container',
  template: `
    <h1>HostListener$(eventName) Container</h1>
    <app-host-listener>
    </app-host-listener>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostListenerContainerComponent {

}
