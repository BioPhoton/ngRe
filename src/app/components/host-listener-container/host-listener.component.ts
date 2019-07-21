import {ChangeDetectionStrategy, Component, ElementRef, HostListener, Inject, Injector} from '@angular/core';
import {Subject} from 'rxjs';
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

  onClick$ = new Subject();
  numClicks$ = this.onClick$.pipe(scan(a => ++a, 0));

  @HostListener$('click')
  hostClick$;

  constructor(public injector: Injector) {
    console.log(this.hostClick$);
  }

  @HostListener('click', ['$event'])
  onClick(e) {
    this.onClick$.next(e);
  }


}