import { ChangeDetectorRef } from '@angular/core';
import {pipe} from 'rxjs';
import {distinctUntilChanged, map, tap} from 'rxjs/operators';

export function selectSlice<T>(mapToSliceFn) {
  return pipe(
    map(mapToSliceFn),
    distinctUntilChanged<T>()
  );
}
