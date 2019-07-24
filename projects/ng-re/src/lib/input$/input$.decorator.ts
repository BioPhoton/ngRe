import {Observable, ReplaySubject, Subject} from 'rxjs';
import {getPropertySubject} from '../core/get-property-subject';

export function Input$<T>(): PropertyDecorator {

  return (
    // @TODO get better typing
    // tslint:disable-next-line
    component: Object,
    propertyKey: PropertyKey
  ) => {
    const keyUniquePerPrototype = Symbol('@ngRe-Input$');
    const subjectFactory = (): Subject<T> => new ReplaySubject<T>(1);

    const propertyKeyDescriptor: TypedPropertyDescriptor<Observable<T>> = {
      set(newValue) {
        // @TODO: Get type of property instead of any
        getPropertySubject<any>(this, keyUniquePerPrototype, subjectFactory).next(newValue);
      },
      get() {
        return getPropertySubject<any>(this, keyUniquePerPrototype, subjectFactory);
      }
    };

    Object.defineProperty(component, propertyKey, propertyKeyDescriptor);


  };

}

