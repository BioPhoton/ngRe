import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <ul>
      <li>
        <a routerLink="push-pipe">PushPipe</a>
      </li>
      <li>
        <a routerLink="live-cycle-hooks">ReactiveLifeCycleHooks</a>
      </li>
      <li>
        <a routerLink="input">Input</a>
      </li>
      <li>
        <a routerLink="from-view">FromView</a>
      </li>
    </ul>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements AfterViewInit {

  constructor(private cd: ChangeDetectorRef) {

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      console.log('ngAfterViewInit');
      this.cd.detectChanges();
    }, 100);

  }

}
