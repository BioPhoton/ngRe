import {pipe} from 'rxjs';
import {distinctUntilChanged, filter, map} from 'rxjs/operators';

export function selectSlice<T>(mapToSliceFn: (s: any) => any) {
  return pipe(
    map(mapToSliceFn),
    map(v => v === undefined ? null : v),
    distinctUntilChanged<T>()
  );
}
