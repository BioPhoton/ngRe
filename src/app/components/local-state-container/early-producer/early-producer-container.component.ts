import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Subject} from 'rxjs';
import {share, shareReplay} from 'rxjs/operators';
import {LocalStateService} from './example.service';

@Component({
  selector: 'app-early-producer-container',
  template: `
    <h2>Early Producer Container</h2>
    <p><b>fromLocalState$</b></p>
    <pre>{{fromLocalState$ | async | json}}</pre>
    <p><b>v</b></p>
    <pre>{{v | async | json}}</pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EarlyProducerContainerComponent {

  notUnderControl = new Subject();
  v = this.notUnderControl
    .pipe(
      shareReplay(1)
    );
  private localState = new LocalStateService();
  fromLocalState$ = this.localState.state$;

  constructor() {
    this.notUnderControl.subscribe(value => {
      this.localState.set({value});

      this.localState.set({timestamp: Date.now()});
    });

    this.fromLocalState$.subscribe(console.log);

    this.notUnderControl.next(1);
  }

}
