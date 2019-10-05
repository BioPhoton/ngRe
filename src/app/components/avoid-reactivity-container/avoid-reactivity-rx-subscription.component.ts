import {HttpClient} from '@angular/common/http';
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
import {interval, of, timer} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {TickService} from './tick.service';

@Component({
  selector: 'app-avoid-rx-subscription',
  template: `
    <h2>Retrieving a single router-param and render it</h2>
    <h3>Leverage Rx</h3>
    <div>Http result: {{result | async | json}}</div>
    <div>TickService value: {{value | async | json}}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvoidReactivityRxSubscriptionComponent {
  result;
  value;

  constructor(private tickService: TickService, private http: HttpClient) {
    this.result = this.http.get('https://api.github.com/users/octocat')
      .pipe(map((user: any) => user.login), tap(console.log));
    this.value = tickService.tick$
      .pipe(
        map(measure => measure.value),
        tap(v => console.log('leverage:', v))
      );
  }

}
