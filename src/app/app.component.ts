import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <div class="zone" [ngClass]="{noop : runningZoneLess}">
      {{runningZoneLess ? 'Zone-Less' : 'Zone-Full'}}
    </div>
    <div class="panel zone-less" *ngIf="runningZoneLess">
      <button>Detect Change</button>
    </div>
    <ul>
      <li>
        <a routerLink="push-pipe">PushPipe</a>
      </li>
      <li>
        <a routerLink="live-cycle-hooks">LifeCycleHooks</a>
        <ul>
          <li>
            <a [routerLink]="['live-cycle-hooks', {selectChange: true}]">SelectChange RxJS Operator</a>
          </li>
        </ul>
      </li>
      <li>
        <a routerLink="input">Input</a>
      </li>
      <li>
        <a routerLink="output">Output</a>
      </li>
      <li>
        <a routerLink="local-state">LocalState</a>
        <ul>
          <li>
            <a [routerLink]="['late-subscribers']">Late Subscribers</a>
          </li>
        </ul>
      </li>
    </ul>
    <router-outlet></router-outlet>
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
      console.log('AppComponent ngAfterViewInit');
      // this.cd.detectChanges();
    }, 1000);
  }

}
