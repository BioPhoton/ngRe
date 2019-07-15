import {ɵComponentDef as ComponentDef, ɵNG_COMPONENT_DEF as NG_COMPONENT_DEF} from '@angular/core';
import {Subject} from 'rxjs';


// @TODO get proper typing  => MethodDecorator || PropertyDecorator ?
export function HostListener$(hookName: string): Function {
  return (
    component: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const subject = new Subject();
    const cDef: ComponentDef<any> = component.constructor[NG_COMPONENT_DEF];
    const originalHook = cDef[hookName] ;

    component[hookName] = (args) => {
      subject.next(args);
      // tslint:disable-next-line:no-unused-expression
      originalHook && originalHook.call(component, args);
    };
    component[propertyKey] = subject.asObservable();
    return component[propertyKey];
  };
}
