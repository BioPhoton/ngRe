import {ɵComponentDef as ComponentDef, ɵNG_COMPONENT_DEF as NG_COMPONENT_DEF} from '@angular/core';
import {fromEvent, Subject} from 'rxjs';


// @TODO get proper typing  => MethodDecorator || PropertyDecorator ?
export function HostListener$(eventName: string): Function {
  return (
    component: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const innerSB = new Subject();
    const retour = innerSB.asObservable();
    const original = component[propertyKey];

    console.log(component);
    // component[propertyKey];
    /*Object.defineProperty(component, propertyKey, {
      set: newValue => innerSB.next(newValue),
      get: () => retour,
      enumerable: true,
      configurable: true
    });*/
    return retour;
  };
}
