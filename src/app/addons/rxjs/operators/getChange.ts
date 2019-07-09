import {SimpleChanges} from '@angular/core';
import {pipe, UnaryFunction} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';

export function getChange(prop: string): UnaryFunction<any, any> {
  return pipe(
    map((change: SimpleChanges) => change[prop].currentValue),
    distinctUntilChanged()
  );
}
