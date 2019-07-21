import {pipe} from 'rxjs';
import {distinctUntilChanged, map, tap} from 'rxjs/operators';
import {STATE_DEFAULT} from '../../core/state-default';

export function selectSlice<T>(mapToSliceFn: (s: any) => any) {
  return pipe(
    map(s => {
      return (s !== STATE_DEFAULT) ? mapToSliceFn(s) : s;
    }),
    distinctUntilChanged<T>(),
    tap(_ => 'slice updated', mapToSliceFn)
  );
}
