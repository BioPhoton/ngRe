import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {interval} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-input-container',
  template: `
    <p>
      input-container works!
    </p>
    <pre>
      {{state$ | push | json}}
    </pre>
    <app-input [state]="state$ | async"></app-input>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputContainerComponent implements OnInit {

  state$ = interval(1000)
    .pipe(
      map(value => ({value}))
    );

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.cdr.detectChanges();
  }

}
