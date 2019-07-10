import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <ul>
      <li>
        <a routerLink="push-pipe">PushPipe</a>
      </li>
      <li>
        <a routerLink="live-cycle-hooks">LifeCycleHooks</a>
      </li>
      <li>
        <a routerLink="input">Input</a>
      </li>
      <li>
        <a routerLink="output">Output</a>
      </li>
    </ul>
    <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit {

  constructor(private cd: ChangeDetectorRef, private router: Router) {

    router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        // tap(_ => detectChanges(this.cd))
      )
      .subscribe(console.log);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      console.log('AppComponent ngAfterViewInit');
      // this.cd.detectChanges();
    }, 1000);
  }

}
