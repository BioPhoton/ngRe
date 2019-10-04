import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input, OnChanges, OnDestroy, OnInit, SimpleChanges
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {interval} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-avoid-subscription',
  template: `
    <h2>Retrieving a single router-param and render it</h2>
    <div>value: {{value}}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvoidReactivitySubscriptionComponent  implements
  OnChanges, OnInit, AfterContentInit, AfterContentChecked, AfterViewInit,
  AfterViewChecked, OnDestroy {
  @Input() value;

  id;

  constructor(private router: ActivatedRoute) {
    this.id = router.params
      .pipe(map(params => params.id));
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
