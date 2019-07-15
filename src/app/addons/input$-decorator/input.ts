import {ɵComponentDef as ComponentDef, ɵNG_COMPONENT_DEF as NG_COMPONENT_DEF} from '@angular/core';
import {Subject} from 'rxjs';

interface Hooks {
  afterContentChecked: string;
  afterContentInit: string;
  afterViewChecked: string;
  afterViewInit: string;
  doCheck: string;
  onChanges: string;
  onDestroy: string;
  onInit: string;
}

const hooksWrapped: { [x in keyof Hooks]: boolean } = {
  afterContentChecked: false,
  afterContentInit: false,
  afterViewChecked: false,
  afterViewInit: false,
  doCheck: false,
  onChanges: true,
  onDestroy: false,
  onInit: false
};

// @TODO get proper typing  => MethodDecorator || PropertyDecorator ?
export function Input$() {
  return (
    component: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const subject = new Subject();
    // @TODO I guess this is a miss conception that ngChanes is wraped in a function.

    component[propertyKey] = subject.asObservable();
    return component[propertyKey];
  };
}


function getCompHookName(hookName: string): string {
  return 'ng' + hookName[0].toUpperCase() + hookName.slice(1);
}
