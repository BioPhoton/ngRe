import {SimpleChanges} from '@angular/core';
import {pipe, UnaryFunction} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';

export function selectChange<T>(prop: string) {
  return pipe(
    map((change: SimpleChanges) => change[prop].currentValue),
    distinctUntilChanged()
  );
}
