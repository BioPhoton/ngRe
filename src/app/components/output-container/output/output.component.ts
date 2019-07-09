import {Component, Output} from '@angular/core';
import {interval} from 'rxjs';

@Component({
  selector: 'app-output',
  template: `
    <p>output works!</p>
  `
})
export class OutputComponent {

  @Output() out = interval(1000);

}
