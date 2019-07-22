import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReplaySubject, Subject} from 'rxjs';
import {LocalStateService} from './example.service';

@Component({
  selector: 'app-late-subscriber',
  template: `
    <h2>Late Subscriber Child</h2>
    <p><b>default$:</b></p>
    <pre>{{default$ | async | json}}</pre>
    <p><b>replayed$</b></p>
    <pre>{{replayed$ | async | json}}</pre>
    <p><b>fromLocalState$</b></p>
    <pre>{{fromLocalState$ | async | json}}</pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LateSubscriberComponent {

  private localState = new LocalStateService();

  default$ = new Subject();
  replayed$ = new ReplaySubject(1);
  fromLocalState$ = this.localState.state$;

  @Input()
  set state(value) {
    this.default$.next({value});
    this.replayed$.next({value});

    this.localState.set({value});
    this.localState.set({timestamp: Date.now()});
  }

  constructor() {
  }

}
