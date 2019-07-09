import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {interval} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-from-view',
  template: `
    <p>
      from-view works!
    </p>
  `,
  styles: []
})
export class OutputBindingComponent implements OnInit {

  @Output() out = new EventEmitter();

  constructor() { }

  ngOnInit() {
    interval(1000)
      .pipe(
        tap(v => this.out.next(v))
      )
      .subscribe();
  }

}
