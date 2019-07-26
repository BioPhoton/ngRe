import {ChangeDetectionStrategy, Component, Input, SimpleChanges} from '@angular/core';
import {Hook$} from 'ng-re';
import {Observable, Observer} from 'rxjs';

@Component({
  selector: 'app-full-example',
  template: `
    <h2>FullExample</h2>
    <p><b>state: </b></p>
    <pre>{{onChanges$ | async | json}}</pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
/*implements OnChanges, DoCheck, OnInit, AfterViewInit,
  AfterViewChecked, AfterContentInit, AfterContentChecked, OnDestroy */
export class FullExampleComponent {

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
    this.doCheck$.subscribe(this.getHookObserver('onCheck$'));
    this.onChanges$.subscribe(this.getHookObserver('onChanges$'));
    this.onInit$.subscribe(this.getHookObserver('onInit$ next'));
    this.afterContentChecked$.subscribe(this.getHookObserver('afterContentChecked$'));
    this.afterContentInit$.subscribe(this.getHookObserver('afterContentInit$'));
    this.afterViewChecked$.subscribe(this.getHookObserver('afterViewChecked$'));
    this.afterViewInit$.subscribe(this.getHookObserver('afterViewInit$'));
    this.onDestroy$.subscribe(this.getHookObserver('onDestroy$'));

  }

  private getHookObserver(name: string): Observer<any> {
    return {
      next(n) {
        console.log(name + ' next', n);
      },
      error(e) {
        console.log(name + ' error', e);
      },
      complete() {
        console.log(name + ' complete');
      },
    };
  }

  /*
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
    */

}
