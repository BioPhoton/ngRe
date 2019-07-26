import {Component, Input} from '@angular/core';
import {interval, Observable} from 'rxjs';
import {filter, map, share} from 'rxjs/operators';

@Component({
  selector: 'app-let-directive-value',
  template: `{{value | json}}  `
})
export class LetDirectiveValueComponent {
  @Input()
  value;
}
