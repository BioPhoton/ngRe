import {SimpleChanges} from '@angular/core';
import {pipe, UnaryFunction} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';

export function getChange(prop: string): UnaryFunction {
  return pipe(
    map((change: SimpleChanges) => change[prop].currentValue),
    distinctUntilChanged()
  );
}
