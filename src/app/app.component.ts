import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <div class="zone" [ngClass]="{noop : runningZoneLess}">
      {{runningZoneLess ? 'Zone-Less' : 'Zone-Full'}}
    </div>
    <div class="page">
      <div class="sidebar">
        <div class="panel zone-less" *ngIf="runningZoneLess">
          <button>Detect Change</button>
        </div>
        <ul>
          <li>
            <a routerLink="push-pipe">entity$ | push$ as entity</a>
          </li>
          <li>
            <a routerLink="hook">@Hook$(hookName)</a>
          </li>
          <li>
            <a routerLink="input">Input</a>
          </li>
          <li>
            <a routerLink="host-listener">HostListener$(eventName)</a>
          </li>
          <li>
            <a routerLink="from-view-event">FromViewEvent$(eventName)</a>
          </li>
          <li>
            <a routerLink="let-directive">[*reLet]="observable$ as o"</a>
          </li>
          <li>
            <a routerLink="local-state">LocalState</a>
          </li>
          <li>
            <a routerLink="star-rating">StarRating</a>
          </li>
        </ul>
      </div>
      <div class="content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit {

  runningZoneLess: boolean;

  constructor(z: NgZone, private cd: ChangeDetectorRef, private router: Router) {
    this.runningZoneLess = z.constructor.name === 'NoopNgZone';
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // this.cd.detectChanges();
    }, 1000);
  }

}
