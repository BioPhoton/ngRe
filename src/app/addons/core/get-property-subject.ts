import {Subject} from 'rxjs';

export function getPropertySubject<T>(
  // tslint:disable-next-line
  objInstance: Object,
  property: PropertyKey,
  subjectFactory: () => Subject<T> = () => new Subject<T>()
): Subject<T> {
  console.log(objInstance, property, subjectFactory);
  return objInstance[property] || (objInstance[property] = subjectFactory());
}
