import {ChangeDetectorRef, Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {isObservable, Observable} from 'rxjs';
import {selectSlice} from '../local-state/operators/selectSlice';
import {LocalStateService} from '../local-state/local-state';

export class LetContext {
  constructor(
    // to enable let we have to use $implicit
    public $implicit?: any,
    // to enable as we have to assign this
    public ngReLet?: any
  ) {
  }
}

@Directive({
  selector: '[ngReLet]',
  providers: [LocalStateService]
})
export class LetDirective implements OnInit {
  private context = new LetContext({});

  @Input()
  set ngReLet(o: { [key: string]: Observable<any> }) {
    if (isObservable(o)) {
      this.lS.connectSlices({ngReLet: o});
    } else {
      this.lS.connectSlices(o);
    }
  }

  constructor(
    private lS: LocalStateService,
    private cd: ChangeDetectorRef,
    private readonly templateRef: TemplateRef<LetContext>,
    private readonly viewContainerRef: ViewContainerRef
  ) {
    this.lS.state$
      .pipe(
        selectSlice(s => s.ngReLet)
      )
      .subscribe(this.updateContext);
    this.lS.state$
      .subscribe(this.updateContext);
  }

  updateContext = (v) => {
      this.context.$implicit = v;
      this.context.ngReLet = v;
      this.cd.detectChanges();
  }

  ngOnInit() {
    this.viewContainerRef
      .createEmbeddedView(this.templateRef, this.context);
  }

}
