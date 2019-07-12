import { ChangeDetectorRef } from '@angular/core';
import {pipe} from 'rxjs';
import { tap } from 'rxjs/operators';

export function detectChanges(cdr: ChangeDetectorRef) {
  return pipe(tap(_ => cdr.detectChanges()));
}
