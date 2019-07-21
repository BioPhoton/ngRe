import {Observable, ReplaySubject, Subject} from 'rxjs';
import {getPropertySubject} from '../core/get-property-subject';
// https://github.com/kevinphelps/ngx-utilities/tree/master/projects


export function Input$<T>(propKeyToObserve: string): PropertyDecorator {

  return (
    // @TODO get better typing
    // tslint:disable-next-line
    component: Object,
    propertyKey: PropertyKey
  ) => {
    const keyUniquePerPrototype = Symbol('@ngRe-Input$');
    const subjectFactory = (): Subject<T> => new ReplaySubject<T>(1);

    const propertyKeyDescriptor: TypedPropertyDescriptor<Observable<T>> = {
      get() {
        // @TODO: Get type of property instead of any
        return getPropertySubject<T>(this, keyUniquePerPrototype, subjectFactory).asObservable();
      },
      // @TODO implement the rest of the property definition
    };

    Object.defineProperty(component, propertyKey, propertyKeyDescriptor);

    const propKeyToObserveDescriptor: TypedPropertyDescriptor<Observable<T>> = {
      set(newValue) {
        // @TODO: Get type of property instead of any
        getPropertySubject<any>(this, keyUniquePerPrototype, subjectFactory).next(newValue);
      }
      // @TODO implement the rest of the property definition
    };
    Object.defineProperty(component, propKeyToObserve, propKeyToObserveDescriptor);

  };

}

