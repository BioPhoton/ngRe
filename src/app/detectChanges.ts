import { ChangeDetectorRef } from '@angular/core';
import { tap } from 'rxjs/operators';

export const detectChanges = (cdr: ChangeDetectorRef) => o$ => o$.pipe(tap(_ => cdr.detectChanges()))
