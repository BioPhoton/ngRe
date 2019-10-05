import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {of} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-avoid-timing',
  template: `
    <h2>Timing</h2>
    <div>Input value: {{value}}</div>
    <div>Component observable property: {{o$ | async}}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvoidReactivityTimingComponent implements OnChanges, OnInit, AfterContentInit, AfterContentChecked, AfterViewInit,
  AfterViewChecked, OnDestroy {
  @Input() value;
  o$ = of(42).pipe(tap(console.log));

  constructor() {
  }

  ngAfterContentChecked(): void {
    console.log('ngAfterContentChecked');
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
  }

  ngAfterContentInit(): void {
    console.log('ngAfterContentInit');
  }

  ngOnInit(): void {
    console.log('ngOnInit');
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges', changes);
  }

  ngAfterViewChecked(): void {
    console.log('ngAfterViewChecked');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
  }

}
