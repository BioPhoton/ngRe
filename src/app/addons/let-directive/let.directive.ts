import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';

class NgxLetContext {
  $implicit: any = null;
}

@Directive({
  selector: '[let]'
})
export class LetDirective implements OnInit {
  private context = new NgxLetContext();

  @Input()
  set let(value: any) {
    this.context.$implicit = value;
  }

  constructor(
    private readonly templateRef: TemplateRef<NgxLetContext>,
    private readonly viewContainerRef: ViewContainerRef
  ) {
    console.log('CTOR');
  }

  ngOnInit() {
    this.viewContainerRef
      .createEmbeddedView(this.templateRef, this.context);
  }
}
