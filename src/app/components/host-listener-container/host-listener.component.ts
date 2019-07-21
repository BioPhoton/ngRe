import {ChangeDetectionStrategy, Component, Injector} from '@angular/core';
import {scan} from 'rxjs/operators';
import {HostListener$} from '../../addons/host-listener$-decorator/host-listener';

@Component({
  selector: 'app-host-listener',
  template: `
    <h2>Host-Listener child component</h2>
    <pre>
      num clicks: {{numClicks$ | async | json}}
    </pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostListenerComponent {


  @HostListener$('click')
  hostClick$;

  numClicks$ = this.hostClick$.pipe(scan(a => ++a, 0));

  constructor(public injector: Injector) {

  }

}
