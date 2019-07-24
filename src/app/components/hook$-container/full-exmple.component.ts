import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {Hook$} from 'ng-re';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-full-example',
  template: `
    <h2>FullExample</h2>
    <p><b>state: </b></p>
    <pre>{{state | json}}</pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullExampleComponent implements OnChanges, DoCheck, OnInit, AfterViewInit,
  AfterViewChecked, AfterContentInit, AfterContentChecked, OnDestroy {

  @Hook$('doCheck') doCheck$: Observable<void>;
  @Hook$('onChanges') onChanges$: Observable<SimpleChanges>;
  @Hook$('onInit') onInit$: Observable<void>;
  @Hook$('afterContentChecked') afterContentChecked$: Observable<void>;
  @Hook$('afterContentInit') afterContentInit$: Observable<void>;
  @Hook$('afterViewChecked') afterViewChecked$: Observable<void>;
  @Hook$('afterViewInit') afterViewInit$: Observable<void>;
  @Hook$('onDestroy') onDestroy$: Observable<void>;

  @Input() state;

  constructor() {
    this.doCheck$.subscribe(v => console.log('doCheck$', v));
    this.onChanges$.subscribe(v => console.log('onChanges$', v));
    this.onInit$.subscribe(v => console.log('onInit$', v));
    this.afterContentChecked$.subscribe(v => console.log('afterContentChecked$', v));
    this.afterContentInit$.subscribe(v => console.log('afterContentInit$', v));
    this.afterViewChecked$.subscribe(v => console.log('afterViewChecked$', v));
    this.afterViewInit$.subscribe(v => console.log('afterViewInit$', v));
    this.onDestroy$.subscribe(v => console.log('onDestroy$', v));

  }

  ngDoCheck(): void {
    console.log('original ngDoCheck');
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('original ngOnChanges', changes);
  }

  ngOnInit(): void {
    console.log('original ngOnInit');
  }

  ngAfterContentInit(): void {
    console.log('original ngAfterContentInit');
  }

  ngAfterContentChecked(): void {
    console.log('original ngAfterContentChecked');
  }

  ngAfterViewInit(): void {
    console.log('original ngAfterViewInit');
  }

  ngAfterViewChecked(): void {
    console.log('original ngAfterViewChecked');
  }

  ngOnDestroy(): void {
    console.log('original ngOnDestroy');
  }

}
