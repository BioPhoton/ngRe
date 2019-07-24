import {ChangeDetectionStrategy, Component, Injector} from '@angular/core';
import {HostListener$} from 'ng-re';
import {scan} from 'rxjs/operators';

@Component({
  selector: 'app-host-listener',
  template: `
    <h2>HostListener$ Child
      <small style="color: red">Click me!</small>
    </h2>
    <p>
      <b>Num clicks:</b>
    </p>
    <pre>
      {{numClicks$ | async | json}}
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
