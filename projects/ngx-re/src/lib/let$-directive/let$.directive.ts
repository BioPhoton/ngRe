import {ChangeDetectorRef, Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {isObservable, Observable} from 'rxjs';
import {selectSlice} from '../local-state$-service/operators/selectSlice';
import {LocalStateService} from '../local-state$-service/local-state';

export class LetContext {
  constructor(
    // to enable let we have to use $implicit
    public $implicit?: any,
    // to enable as we have to assign this
    public reLet?: any
  ) {
  }
}

@Directive({
  selector: '[reLet]',
  providers: [LocalStateService]
})
export class Let$Directive implements OnInit {
  private context = new LetContext({});

  @Input()
  set reLet(o: { [key: string]: Observable<any> }) {
    console.log('reLet', o);
    if (isObservable(o)) {
      this.lS.connectSlices({reLet: o});
    }
    this.lS.connectSlices(o);
  }

  constructor(
    private lS: LocalStateService,
    private cd: ChangeDetectorRef,
    private readonly templateRef: TemplateRef<LetContext>,
    private readonly viewContainerRef: ViewContainerRef
  ) {
    this.lS.state$
      .pipe(
        selectSlice(s => s.reLet)
      )
      .subscribe(this.updateContext);
    this.lS.state$
      .subscribe(this.updateContext);
  }

  updateContext = (v) => {
      this.context.$implicit = v;
      this.context.reLet = v;
      // this.cd.detectChanges();s
  }

  ngOnInit() {
    this.viewContainerRef
      .createEmbeddedView(this.templateRef, this.context);
  }

}
