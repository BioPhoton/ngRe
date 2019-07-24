import {ChangeDetectorRef, Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {isObservable, Observable} from 'rxjs';
import {LocalStateService} from '../local-state/local-state';
import {selectSlice} from '../local-state/operators/selectSlice';

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
  set ngReLet(o: { [key: string]: Observable<any> } | Observable<any>) {
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
    this.context.$implicit = {};
    this.context.ngReLet = {};

    this.lS.state$
      .pipe(
        selectSlice(s => s.ngReLet)
      )
      .subscribe(this.updateContext);
    this.lS.state$
      .subscribe(this.updateContext);
  }

  updateContext = (v) => {
    // to enable `let` syntax we have to use $implicit
    this.context.$implicit = v;
    // to enable `as` syntax we have to assign the directives selector
    this.context.ngReLet = v;
    // tslint:disable-next-line
    v && Object.entries(v).map(([key, value]) => this.context[key] = value);
    this.cd.detectChanges();
  };

  ngOnInit() {
    this.viewContainerRef
      .createEmbeddedView(this.templateRef, this.context);
  }

}
