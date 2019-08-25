import {Component} from '@angular/core';
import {combineLatest, interval, Observable} from 'rxjs';
import {filter, map, share, take} from 'rxjs/operators';

@Component({
  selector: 'app-let-directive-full-example',
  template: `
    <h2>*Full Example</h2>
    
    https://github.com/angular/angular/issues/15280#issuecomment-290913071
    
    <app-let-directive-supported-syntax></app-let-directive-supported-syntax>
    <app-let-directive-observable-channels></app-let-directive-observable-channels>
  `
})
export class LetDirectiveFullExampleComponent {

}
