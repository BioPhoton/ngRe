# ReactiveAddons

This project is a proposal for a set of basic angular extensions to
create a fully reactive Angular application without hacks and workarounds.

At the moment its just creating POC's and see where we glue is needed in angular.
Also still not fix as ivy may update a little internally.

Things suggested:
- Push Pipe (+++)
- Observable Life Cycle Hooks (+++)
- Observable Templates (++)
- Multi Let Directive (++)
- Observable Bindings (+)
- Local State Management (+)


# Push Pipe

An angular pipe similar to the `async` pipe but triggers `detectChanges` instead of `markForCheck`.
This is required to run zone-less. We render on every pushed message.

The pipe should work on as template binding `{{thing$ | push}}` 
as well as input binding `[color]="thing$ | push"`
```html
<div *ngIf="(thing$ | push) as thing">
  color: {{thing.color}}
  shape: {{thing.shape}}
<div>

<app-color [color]="(thing$ | push).color">
</app-color>
```

Here multiple subscriptions in the view could lead to 
performance issues. Unfortunately we see this a lot of applications.

```html
<div>
  color: {{(thing$ | push).color}}
  shape: {{(thing$ | push).shape}}
<div>

<app-color [color]="(thing$ | push).color">
  {{(thing$ | push).shape}}
</app-color>
```

# Observable Life Cycle Hooks

To get inputs as observables is crucial for any reactive architecture. 
Also to render push based we need to depend on life-cycle hooks as an observable.

The goal would be to create a generic decorator `@hooks$()` that 
hooks into methods registered in the components constructor. 

```typescript
  @hook$('onInit') onInit$;
  @hook$('onDestroy') onDestroy$;

  time$: this.onInit$
    .pipe(
      switchMapTo(interval(1000)),
      map(_ => Date.now()),
      takeUntil(this.onDestroy$)
    )
    .subscribe();
```

Unfortunately the `onChanges` feature is different then the rest and it is not possible to extend it in a normal way.
The onChanges feature is created over [wrapOnChanges](https://github.com/angular/angular/blob/e688e02ee442658c754d813e84a9908baf874520/packages/core/src/render3/features/ng_onchanges_feature.ts#L58) that encapsulates the `this`

```typescript
if(hookName === 'onChanges') {
    const originalHook = component['ngOnChanges'];
    component['onChanges'] = function() {
      subject.next(args);
      original && original.call(component, args);
    }
}
``` 


# Observable Templates

Observables direct from templates. 
In best case directly over vanilla js, no output bindings from angular.  
With web-components this is possible here no need to rely on angular specific template syntax.

```typescript
  ngAfterContentInit() {
    const viewElem = document.getElementById('id1');
    
    fromViewElem(viewElem,'output-binding')
      .subscribe(console.log);
  }
```

It could include view and content lifecycle hooks so we don't need to care about it.

A workaround could be to create decorators or directives.

[@elmd_](https://twitter.com/elmd_) already published something for angular:
https://www.npmjs.com/package/@typebytes/ngx-template-streams

```typescript
 @Component({...
 template: `
 <button (*click)="clicks$">Click Me (Stream)</button>
 `})
 export class AppComponent {
  @ObservableEvent()
  clicks$: Observable<any>;
 
  ngOnInit() {
    this.clicks$.subscribe(console.log);
  }
```

# Multi Let Structural Directive

The multi let directive is a not tested idea of binding multiple 
observables in the same view context. 

Here multiple subscriptions in the view could lead to 
performance issues. Unfortunately there is no other built in.

```html
<div *ngIf="(o$ | push) as o">
  <div *ngIf="(o2$ | push) as o2">
    <div *ngIf="(o3$ | push) as o3">
      <app-color 
      [color]="o.color" [shape]="o.shape" 
      [name]="o2.name" [age]="o2.age"
      [value]="o3">
      </app-color>  
     </div>
   <div>
</div>
```

A custom directive could probably solve it. `*multiLet="o$ | push as o; t$ | push as t;"` 
This would help to the nested divs and the number of the subscriptions.

```html
<div *multiLet="o1$ | push as o1;
                o2$ | push as o2;
                o3$ | push as o3;">
  <app-color 
    [color]="o1.color" [shape]="o1.shape" 
    [name]="o2.name" [age]="o2.age"
    [value]="o3">
  </app-color>  
</div>
```

# Observable Bindings
- @Input() Bindings
- @Output() Bindings

## Input Bindings

Operators to select a specific slice from onChanges. 
It is also multi casted over `shareReplay(1)` and also caches the latest value for late subscribers.

This operator is used in combination with `OnChanges` as observable hook.
It provides also a very early method of control of the forwarded values.

Important to mention is that it should have some sort of cache implemented as `new ReplaySubject(1)` 
(or maybe `.shareReplay(1)` if it returns a connected observable)  

```typescript
@hook$('onChanges') 
onChanges$;

@Input() 
state;

state$ = this.onChanges$.pipe(selectChange('state'));
``` 

With this primitive we can easily have observable inputs like that:

```typescript
export class MyComponent {
  @hook$('onChanges') 
  onChanges$: Observable<SimpleChanges>;

  @Input() state;
  state$ = this.onChanges$.pipe(getChange('state'));
}
```

Another maybe too over engineered way could be 
combining the hook as well as the `@Input()` declaration. 

```typescript
export class MyComponent {
  @ReactiveInput()
  state$ = this.onChanges$.pipe(getChange('state'));
}
```

## Output Bindings

As output bindings set up inside of an component can directly forward a observable. No need for EventEmitter nor Subject.
This anyway leads to imperative programming.

```typescript
@Output() 
stateChange = this.state$
    .pipe(
      map(state => state.slice),
      distinctUntilChanged()
    );
```

As output bindings set up outside of an component can consumed over 

# Local State Management

A tiny logic that combines:
- values over input bindings
- class internal
- state rendered to view 
- state from a services.

A flexible way to query a state slice.
It considers also late subscriber. 

Handling late subscriber is especially useful when working with lifecycle hooks.
Here values arrive over inputs and the subscription happens later in AfterViewInit. 
We normally would loose this value. 

```typescript
buttons$ = this.lS.state$
      .pipe(
        selectChange('buttons')
      );
```

A way to connect events from the view and component as observable.

```typescript
constructor(private lS: LocalState<MyState>) {
  this.lS
    .connectSlice('num', interval(1000));
  this.lS
    .connectSlice('isNew', this.isNew$);
  this.lS
    .connectSlice('buttons', this.buttons$);
}
``` 
