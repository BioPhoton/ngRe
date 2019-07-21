import {Component, OnInit} from '@angular/core';
import {interval} from 'rxjs';

@Component({
  selector: 'app-let-directive-container',
  template: `
    <p>
      let-directive-container works!
    </p>
    <ng-container
      *let="test$ | async; let test">
      value: {{test}}
    </ng-container>
  `,
  styles: []
})
export class LetDirectiveContainerComponent implements OnInit {

  test$ = interval(1000);
  test2$ = interval(500);

  constructor() {
  }

  ngOnInit() {
  }

}
