import {ɵComponentDef as ComponentDef, ɵNG_COMPONENT_DEF as NG_COMPONENT_DEF} from '@angular/core';
import {Observable, ReplaySubject, Subject} from 'rxjs';
// https://github.com/kevinphelps/ngx-utilities/tree/master/projects

// @TODO get proper typing  => PropertyDecorator ?
export function Input$(inputName: string): Function {
  return (
    component: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    // Replay is important for late subscriber
    const subject = new ReplaySubject(1);

    Object.defineProperty(component, inputName, {
      set: newValue => {
        subject.next(newValue);
      },
      get: () => {
        return subject.asObservable();
      }
    });
    component[propertyKey] = subject.asObservable();
    return component[propertyKey];
  };
}

export function ObserveProperty<T>(observedPropertyKey: keyof T) {
  const propertySymbol = Symbol();

  return (target: T, propertyKey: PropertyKey) => {
    Object.defineProperty(target, propertyKey, { get: getChangesObservable });
    Object.defineProperty(target, observedPropertyKey, { get: getValue, set: setValue });
  };

  interface Property {
    hasValue?: boolean;
    currentValue?: any;
    changesObservable?: Observable<any>;
    changesSubject?: ReplaySubject<any>;
  }

  function getProperty(instance: { [propertySymbol]: Property }) {
    const property = instance[propertySymbol] || (instance[propertySymbol] = {});

    if (property.hasValue === undefined) {
      property.hasValue = false;
    }

    if (property.changesSubject === undefined) {
      property.changesSubject = new ReplaySubject(1);
      property.changesObservable = property.changesSubject.asObservable();
    }

    return property;
  }

  function getChangesObservable(this: any) {
    return getProperty(this).changesObservable;
  }

  function getValue(this: any) {
    return getProperty(this).currentValue;
  }

  function setValue(this: any, value: any) {
    const property = getProperty(this);
    const oldValue = property.currentValue;
    const firstChange = !property.hasValue;

    property.hasValue = true;
    property.currentValue = value;

    if (firstChange || value !== oldValue) {
      property.changesSubject.next(value);
    }
  }
}
