import {Injectable, OnDestroy} from '@angular/core';
import {Hook$} from '@ngx-re';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DummyService implements OnDestroy {

  @Hook$('onDestroy') onDestroy$: Observable<void>;

  constructor() {
    this.onDestroy$.subscribe(v => console.log('Service onDestroy$', v));

  }

  ngOnDestroy(): void {
    console.log('service original ngOnDestroy');
  }

}
