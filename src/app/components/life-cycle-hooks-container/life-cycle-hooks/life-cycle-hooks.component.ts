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
import {Observable} from 'rxjs';
import {hook$} from '../../../addons/decorators/hook';

@Component({
  selector: 'app-reactive-lifecycle-hooks',
  template: `
    <p>reactive-lifecycle-hooks works!</p>
    {{state | json}}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LifeCycleHooksComponent implements OnChanges, DoCheck, OnInit, AfterViewInit,
  AfterViewChecked, AfterContentInit, AfterContentChecked, OnDestroy {

  @hook$('doCheck') doCheck$: Observable<void>;
  @hook$('onChanges') onChanges$: Observable<SimpleChanges>;
  @hook$('onInit') onInit$: Observable<void>;
  @hook$('afterContentChecked') afterContentChecked$: Observable<void>;
  @hook$('afterContentInit') afterContentInit$: Observable<void>;
  @hook$('afterViewChecked') afterViewChecked$: Observable<void>;
  @hook$('afterViewInit') afterViewInit$: Observable<void>;
  @hook$('onDestroy') onDestroy$: Observable<void>;

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
