import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, OnInit,} from '@angular/core';
import {map, tap} from 'rxjs/operators';
import {TickService} from './tick.service';

@Component({
  selector: 'app-avoid-subscription',
  template: `
    <h2>Retrieving a single router-param and render it</h2>
    <h3>Avoid Rx</h3>
    <div>Http result: {{result | json}}</div>
    <div>TickService value: {{value | json}}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvoidReactivitySubscriptionComponent implements OnInit {
  result;
  value = 10;

  constructor(private tickService: TickService, private http: HttpClient) {

  }

  ngOnInit() {
    this.result = this.http.get('https://api.github.com/users/octocat')
      .pipe(map((user: any) => user.login))
      .subscribe(result => this.result = result);

    this.tickService.tick$
      .pipe(
        map(measure => measure.value),
        // tap(v => console.log('avoid:', v))
      )
      .subscribe(value => {
        console.log('sub v:', value);
        this.value = value;
      });
  }
}
