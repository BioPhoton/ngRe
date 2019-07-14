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
export function Hook$(hookName: string): Function {
  return (
    component: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const subject = new Subject();
    const cDef: ComponentDef<any> = component.constructor[NG_COMPONENT_DEF];

    let target;
    let hook;
    let originalHook;


    if (cDef === undefined) {
      target = component;
      hook = getCompHookName(hookName);
      originalHook = target[hook];
    } else {

      // @TODO I guess this is a miss conception that ngChanes is wraped in a function.
      target = hooksWrapped[hookName] ? component : cDef;
      hook = hooksWrapped[hookName] ? getCompHookName(hookName) : hookName;
      // @TODO fix case for ngOnChanges not implemented
      originalHook = hooksWrapped[hookName] ? cDef[hook] : component[hook];
    }

    target[hook] = (args) => {
      subject.next(args);
      // tslint:disable-next-line:no-unused-expression
      originalHook && originalHook.call(component, args);
    };


    component[propertyKey] = subject.asObservable();
    return component[propertyKey];
  };
}


function getCompHookName(hookName: string): string {
  return 'ng' + hookName[0].toUpperCase() + hookName.slice(1);
}
