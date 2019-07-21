import {Component, Output} from '@angular/core';
import {interval} from 'rxjs';
import {share} from 'rxjs/operators';

@Component({
  selector: 'app-from-view-event',
  template: `
    <h2>Observable as @Output() value</h2>
    <p><b>Last output emission:</b></p>
    <pre>
      {{interval$ | async$ | json}}
    </pre>
  `
})
export class FromViewEventComponent {
  interval$ = interval(1000).pipe(share());
  @Output() out = this.interval$;
}
