import {ɵComponentDef as ComponentDef, ɵNG_COMPONENT_DEF as NG_COMPONENT_DEF} from '@angular/core';
import {Subject} from 'rxjs';


// @TODO get proper typing  => MethodDecorator || PropertyDecorator ?
export function HostListener$(eventName): Function {
  return (
    component: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const subject = new Subject();
    const originalHook = component[propertyKey] ;

    console.log(propertyKey);
    component[propertyKey] = (...args) => {
      subject.next(args);
      console.log('args, component', args, component);
      // tslint:disable-next-line:no-unused-expression
      originalHook && originalHook.apply(component, args);
    };
    // return component[propertyKey];
  };
}
