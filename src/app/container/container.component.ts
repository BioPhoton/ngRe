import {ChangeDetectionStrategy, Component} from '@angular/core';
import {timer} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';

@Component({
  selector: 'app-container',
  template: `
    <div>
      <button
        *ngFor="let v of dV | keyvalue"
        (click)="dV[v.key] = !dV[v.key]"
        [style.fontWeight]="dV[v.key] ? 'bold' : ''">
        {{v.key}}
      </button>
      <br>
      <button (click)="isNew = !isNew">
        onlyNewRefs: {{isNew}}
      </button>
      <br>
      <div *ngIf="dV.async">
        async-pipe: {{primitiveInterval$ | async}}
      </div>
      <div *ngIf="dV.primitive">
        primitiveInterval$ | push: {{primitiveInterval$ | push}}
      </div>
      <div *ngIf="dV.mutable">
        mutableInterval$ | push: {{(mutableInterval$ | push)?.value}}
      </div>
      <div *ngIf="dV.mutableArgs">
        mutableInterval$ | push:forwardOnlyNewRefs: {{(mutableInterval$ | push:isNew)?.value}}
      </div>
      <div *ngIf="dV.immutable">
        immutableInterval$ | push: {{(immutableInterval$ | push)?.value}}
      </div>
      <div *ngIf="dV.input">
        <h1 style="color: red">Why is it not passing the input boundary??</h1>
        <app-display
          [value]="primitiveInterval$ | push">
        </app-display>
      </div>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerComponent {
  dV = {
    async: false,
    primitive: false,
    mutable: false,
    mutableArgs: false,
    immutable: false,
    input: false
  };

  isNew = true;

  mutualData = {value: 0};
  primitiveInterval$ = timer(0, 1000).pipe(shareReplay(1));
  mutableInterval$ = this.primitiveInterval$.pipe(
    map(value => {
      this.mutualData.value = value;
      return this.mutualData;
    })
  );
  immutableInterval$ = this.primitiveInterval$.pipe(
    map(value => ({value}))
  );
}
