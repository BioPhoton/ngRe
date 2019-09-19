import {ChangeDetectorRef, Component, NgZone} from '@angular/core';
import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {EMPTY, NEVER, Observable, of, ReplaySubject} from 'rxjs';
import {PushPipe} from './push$.pipe';

@Component({
  template: `<p>{{(value$ | push$ | json) || 'undefined'}}</p>`
})
class BasicTestsComponent {
  value$: any = new ReplaySubject(1);
}

@Component({
  template: `<p>{{(value$ | push$:onlyNewRef)?.value}}</p>`
})
class FlagsTestsComponent {

  initialValue = '';
  // forwardOnlyNewReferences option
  onlyNewRef = true;
  value$ = new ReplaySubject<{ value: string }>(1);


  constructor() {
    const a = {value: this.initialValue};
    this.value$.next(a);
    a.value = 'mutation';
    this.value$.next(a);
  }
}

describe('PushPipe', () => {

  let basicTestsComponent: BasicTestsComponent;
  let basicTestsFixture: ComponentFixture<BasicTestsComponent>;

  let flagsTestsComponent: FlagsTestsComponent;
  let flagsTestsFixture: ComponentFixture<FlagsTestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BasicTestsComponent,
        FlagsTestsComponent,
        PushPipe
      ],
      providers: [ChangeDetectorRef, NgZone]
    });

    basicTestsFixture = TestBed.createComponent(BasicTestsComponent);
    basicTestsComponent = basicTestsFixture.componentInstance;

    flagsTestsFixture = TestBed.createComponent(FlagsTestsComponent);
    flagsTestsComponent = flagsTestsFixture.componentInstance;
  });

  it('create an instance', inject([ChangeDetectorRef, NgZone], (cd: ChangeDetectorRef, ngZone: NgZone) => {
      const pipe = new PushPipe(cd, ngZone);
      expect(pipe).toBeTruthy();
    }));

  it('should create test-component for push pipe', () => {
    expect(basicTestsComponent).toBeDefined();
  });

  it('when initially passed `undefined` the pipe should **forward `undefined`** as value as on value ever was emitted', () => {
    const testValue = undefined;

    basicTestsComponent.value$.next(testValue);
    basicTestsFixture.detectChanges();

    basicTestsComponent.value$
      .subscribe(value => {
        expect(value).toBe(testValue);
        // See component view for reason of `+ ''`
        expect(getComponentElem(BasicTestsComponent).innerHTML).toBe(testValue + '');
      });

  });

  it('when initially passed `null` the pipe should **forward `null`** as value as `null` was emitted', () => {
    const testValue = null;

    basicTestsComponent.value$.next(testValue);
    basicTestsFixture.detectChanges();

    basicTestsComponent.value$
      .subscribe(value => {
        expect(value).toBe(testValue);
        // See component view for reason of `+ ''`
        expect(getComponentElem(BasicTestsComponent).innerHTML).toBe(testValue + '');
      });

  });

  it('when initially passed `of(undefined)` the pipe should **forward `undefined`** as value as `undefined` was emitted', () => {
    const testValue = undefined;

    basicTestsComponent.value$ = of(testValue);
    basicTestsFixture.detectChanges();

    basicTestsComponent.value$
      .subscribe(value => {
        expect(value).toBe(testValue);
        // See component view for reason of `+ ''`
        expect(getComponentElem(BasicTestsComponent).innerHTML).toBe(testValue + '');
      });

  });

  it('when initially passed `of(null)` the pipe should **forward `null`** as value as `null` was emitted', () => {
    const testValue = null;

    basicTestsComponent.value$ = of(testValue);
    basicTestsFixture.detectChanges();

    basicTestsComponent.value$
      .subscribe(value => {
        expect(value).toBe(testValue);
        // See component view for reason of `+ ''`
        expect(getComponentElem(BasicTestsComponent).innerHTML).toBe(testValue + '');
      });

  });

  it('when initially passed `EMPTY` the pipe should **forward `undefined`** as value as on value ever was emitted', () => {
    const testValue = undefined;

    basicTestsComponent.value$ = EMPTY;
    basicTestsFixture.detectChanges();

    basicTestsComponent.value$
      .subscribe(value => {
        expect(value).toBe(testValue);
        expect(getComponentElem(BasicTestsComponent).innerHTML).toBe(testValue + '');
      });

  });

  it('when initially passed `NEVER` the pipe should **forward `undefined`** as value as on value ever was emitted', () => {
    const testValue = undefined;

    basicTestsComponent.value$ = NEVER;
    basicTestsFixture.detectChanges();

    basicTestsComponent.value$
      .subscribe(value => {
        expect(value).toBe(testValue);
        // See component view for reason of `+ ''`
        expect(getComponentElem(BasicTestsComponent).innerHTML).toBe(testValue + '');
      });

  });

  it('when reassigned a new `Observable` the pipe should **forward `undefined`** as value as no value was emitted from the new Observable', () => {
    const testValue = undefined;

    basicTestsComponent.value$ = new Observable(() => {
    });
    basicTestsFixture.detectChanges();

    basicTestsComponent.value$
      .subscribe(value => {
        expect(value).toBe(testValue);
        expect(getComponentElem(BasicTestsComponent).innerHTML).toBe(testValue);
      });

  });

  it('when completed the pipe should **keep the last value** in the view until reassigned another observable', () => {
    const testValue = 'test';
    const expectedViewValue = '"test"';

    basicTestsComponent.value$ = of(testValue);
    basicTestsFixture.detectChanges();

    basicTestsComponent.value$
      .subscribe(value => {
        expect(value).toBe(testValue);
        expect(getComponentElem(BasicTestsComponent).innerHTML).toBe(expectedViewValue);
      });

    basicTestsFixture.detectChanges();

    basicTestsComponent.value$
      .subscribe(value => {
        expect(value).toBe(testValue);
        expect(getComponentElem(BasicTestsComponent).innerHTML).toBe(expectedViewValue);
      });

    basicTestsComponent.value$ = of(undefined);
    basicTestsFixture.detectChanges();

    basicTestsComponent.value$
      .subscribe(value => {
        expect(value).toBe(undefined);
        expect(getComponentElem(BasicTestsComponent).innerHTML).toBe('undefined');
      });

  });

  it('when sending a value the pipe should **forward the value** without changing it', () => {
    const testValue = 'value';
    const expectedViewValue = `"${testValue}"`;
    basicTestsComponent.value$.next(testValue);
    basicTestsFixture.detectChanges();

    basicTestsComponent.value$
      .subscribe(value => {
        expect(value).toBe(testValue);
        expect(getComponentElem(BasicTestsComponent).innerHTML).toBe(expectedViewValue);
      });

  });

  it('when the `forwardOnlyNewReferences` is set it should forward only new references', () => {

  });

  // ====================================================

  function getComponentElem(ClassName): HTMLElement {
    let debugEl: HTMLElement;
    if (ClassName === BasicTestsComponent) {
      debugEl = basicTestsFixture.debugElement.nativeElement;
    } else {
      debugEl = flagsTestsFixture.debugElement.nativeElement;
    }
    return debugEl.querySelector('p');
  }

});
