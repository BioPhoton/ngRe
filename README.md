# Proposal for a fully reactive architecture in Angular
#### 

This document is a proposal for a fully reactive architecture in Angular.
It's main goal is to serve as the glue between your reactive code and the framework.
  
Parts of Angular like the `ReactiveFromsModule`, `RouterModule`, `HttpClientModule` ect. are already reactive.
for those who prefere imperative code it's little effort to restrict it to a simple subscription.

On the other hand for those who prefere reactive code it's not that easy. 
A lot of convinenc is missing, and beside the `async` pipe there is pretty much nothing there to take away the manual mapping to observables. Furthermore an increasing number of packages start to be fully observable based. A very popular and widely used example is `ngRx`. It anables us to maintain a global pushbased state management based on observables.

This creates even more interest and need for reactive primitives like the `aysnc` and other template syntax and decorators.
 
Goal would be to **give an overiew** of the needs and a **suggested set of extensions** to make it more convinient to **work in a reactive architecture**.

---
## Table of content
---
- Sections Important For Reactive Architecture
  - Observable Component Bindings
    - DomElement
    - WebComponent
    - AngularComponent
  - Observable Life Cycle Hooks
    - OnChanges
    - OnInit
    - DoCheck
    - AfterContentInit
    - AfterContentChecked	
    - AfterViewInit
    - OnDestroy
- Suggested Extensions
---

# Sections Important For Reactive Architecture

Here we will try to list all areas in angular where such helper primitives would be needed. 
The first step is to list all possible situations and a very simple solution for a reactive approach.
Each area may have different requirements to be more convenient to use in an reactive way. 

Every section explains the current _imperative_ aproach as well as the _reactive_ aproach in a simple way.
This should help to understand the problems and get a good overview of the optios and needs for a reactive architecture in angular.

Based on the collected inforamtion we can try to use the explored options to create an elegant solution for the eplored needs.

Following topics are documented below:
- Component Bindings
- Life Ciyle Hooks

## Component Bindings

As a main requirement for a reactive architecture in current component oriented 
frameworks is handling properties and events of components.

The goal here is to find a unified way to have properties and events as observables integrated in angular.

Here we discuss 3 different types we consider: 
- DomElement
- WebComponent
- AngularComponent


### DomElement

DomElements is everything you can query from `document`.

Goal is to list vanilla js versions as well as the angular way and list options on how to make property values and events working with angular.

#### Send to property over `<elem attr=""></elem>`

To set a value for an input attribute you can query the dom get the item and set the value.

```typescript
const elem = document.getElementById('elem-1');
const elem.value = 42;        
```

This case is easy to cover in a general case as there are many 
built in directives that enables us to set attributes on elements with angular.

**Imperative aproach:**

```typescript
@Component({
  selector: 'my-app',
  template: `
    <button id="p1" [disabled]="disabled">Btn</button>
  `
})
export class AppComponent  {
  disabled = false;
}
```

**Reactive aproach:**

Angular provides a set of decorators for all standard dom attributes. 
This this the suggested way to go and explainde in detail in the AngularComponent section.  

#### Receive events over `elem.addEventListener()`

**Imperative aproach:**

```typescript
const elem = document.getElementById('elem-1');
elem
  .addEventListener('click', e => {
    console.log('click event:', e);
  });
``` 

**Reactive aproach:**

```typescript
const elem = document.getElementById('elem-1');
fromEvent(elem, 'click')
  .subscribe(e => {
    console.log('click event:', e);
  });
``` 

### WebComponent 

Goal is to list vanilla js versions as well as the angular way and list options on how to make property values and events working with angular.

#### Send to property over `<elem attr=""></elem>`  

**Imperative aproach:**
**Reactive aproach:**

#### Receive events over `elem.addEventListener()`

**Imperative aproach:**

**Reactive aproach:**

### AngularComponents

In angular we have an equivalent to properties and events, _input_ and _output_ bindings_.
But we also have several other options for available to interact with components.

Goal is to list all features in angular that interfere with Component Bindings or similar and provide a imperative as well as reavtive aproach for each option.

We consider following decorators:
- Input Decorator
- Output Decorator
- HostListener Decorator 
- HostBinding Decorator

And consider following bindings:
- Input Binding
- Output Binding

#### Input Decorator

Inside of a compoent or directive we can connect properties with the components inpit bindings over the `@Input()` decorator.
This enables us to access the incomings values in the component. 

**_Receive property values over `@Input('state')`_**

**Imperative approach:**

```typescript
@Component({
  selector: 'app-child',
  template: `<p>State: {{state | json}}</p>`
})
export class ChildComponent  {
  @Input() state;
}
``` 

**Reactive approach:**

Here we have to consider to cache the latest value from state input binding.
As OnChanges fires before AfterViewInit we normaly would lose the first value sent. Using a some caching mechanism prevents this.
Furthermore and most iportantly **this makes it independent from the lifecycle hooks**.

```typescript
@Component({
  selector: 'app-child',
  template: `<p>State: {{state$ | async | json}}</p>`
})
export class ChildComponent  {
  state$ = new ReplaySubject(1);
  @Input() 
  set state(v) {
      this.state$.next(v);
  };
}
``` 

**Needs:**
TBD

#### Output Decorator

**_Send event over `eventEmitter.emit(42)`_**

Inside of a compoent or directive we can connect events with the components output bindings over the `@Output()` decorator.
This enables us to emit values to it's parent component. 

**Imperative approach:**

```typescript
@Component({
  selector: 'app-child',
  template: `<button (click)="onClick($event)">Btn</button>`
})
export class ChildComponent  {
  @Output()
  clickEmitter = new EventEmitter();
 
  onClick(e) {
    this.clickEmitter.next(e.timeStamp); 
  }
}
``` 

**Reactive approach:**

Here we changes 2 things.
We usr a `Subject` to retreive the button click event and we 
**provide an observable instead of an EventEmitter for @Output()**.

Important to know it that the `EventEmitters` part of forwarding the values is not the `Observer` part (next or emit), 
it's the implementation of `Subscription`. This enables us to use an Observable ans stay fully `declarative`

```typescript
@Component({
  selector: 'app-child',
  template: `<button (click)="clickEmitter.next($event)">Btn</button>`
})
export class ChildComponent  {
  btnClick = new Subject();
  
  @Output()
  clickEmitter = this.btnClick
    .pipe(
      map(e => e.timeStamp)
    );
}
```

**Needs:**
TBD

#### HostListener Decorator

**_Receive event from host over `eventEmitter.emit(42)`_**

Inside of a compoent or directive we can connect host events with a component method over the `@HostListener()` decorator.
This enables us to retrieve the hosts events. 

**Imperative approach:**

```typescript
@Component({
  selector: 'app-child',
  template: `<p>Num: {{num}}</p>`
})
export class ChildComponent  {
  num = 0;
  @HostListener('click', ['$event'])
  onClick(e) {
    this.num = ++this.num;
  }
}
``` 

**Reactive approach:**

```typescript
@Component({
  selector: 'app-child',
  template: `<p>Num: {{num$ | async}}</p>`
})
export class ChildComponent  {
  numSubj = new BehaviorSubject(0);
  num$ = this.numSubj.pipe(scan(a => ++a));

  @HostListener('click', ['$event'])
  onCllick(e) {
    this.numSubj.next(e);
  }
}
```

**Needs:**
Get rid of the onCkick function and subject creation.

#### HostBinding Decorator

**_Receive property changes from host over `@HostBinding('class')`_**

Inside of a compoent or directive we can connect DOM attribute as from the host with component property. 
Angular automatically updates the host element over change detection.
In this way we can retreive the hosts propertie changes.


**Imperative approach:**

```typescript
@Component({
  selector: 'app-child',
  template: `<p>color: {{className}}</p>`,
})
export class ChildComponent  {
  className = 'visible'
  
  @HostBinding('class')
  get background() {
   return this.className;
  }
}
``` 

**Reactive approach:**

```typescript
TBD
```

**Needs:**
Provide an observable instead of a function

#### Input Binding 

**_Send value changes to child compoent input `[state]="state"`_**

In the parent compoent we can connect component properties to child component inputs over specific template syntax, the square brackets `[state]`.
Angular automatically updates the child component over change detection.
In this way we can send component propertie changes.

**Imperative approach:**

```typescript
@Component({
  selector: 'my-app',
  template: `
    <app-child [state]="state"></app-child>
  `
})
export class AppComponent  {
  state = 42;
}
``` 

**Reactive approach:**

Important to say is that with this case **we can ignore the life cycle hooks as the subscription happens always right in time**.
We cal rely trust that subscription to `state$` happens after `AfterViewInit`.

```typescript
@Component({
  selector: 'my-app',
  template: `
    <app-child [state]="state$ | async"></app-child>
  `
})
export class AppComponent  {
  state$ = of(42);
}
```


**Needs:**
As we know exactly when changes happen we can trigger change detection manually. Knowing the advantaes of subscriptions over the template and lifecycle hooks the solotion should be similar to `async` pipe.


#### Output Binding 

**_Receive events from child compoent over `(stateChange)="fn($event)"`_**

In the parent compoent we can receive events from child components  over specific template syntax, the round brackets `(stateChange)`.
Angular automatically updates fires the provides function over change detection.
In this way we can reveive component events.

**Imperative approach:**

```typescript
@Component({
  selector: 'my-app',
  template: `
    state: {{state}}
    <app-child (stateChange)="onStateChange($event)"></app-child>
  `
})
export class AppComponent  {
  state;
  onStateChange(e) {
    this.state = e; 
  }
}
``` 

**Reactive approach:**

```typescript
@Component({
  selector: 'my-app',
  template: `
    state: {{state$ | async}}<br>
    <app-child (stateChange)="state$.next($event)"></app-child>
  `
})
export class AppComponent  {
  state$ = new Subject();
}
```


**Needs:**  
We need a way to abstracting away the subject initialisation and link a enelemt in the view with a components property.

## Life Cycle Hooks

As the componentts logic can partially rely on the conponents life cycle hooks we also need to consider the in out evaluation. 

Angular fires a viraety of lifecycle hooks. Some of them a single time some of them only once a compoennts lifetime.

Angulars life cycle hooks are listed ere in ordere:   
(Here the Interface name is used. The inplementd method starts with the prefix 'ng')
- OnChanges (ongoing, transports changes)
- OnInit (single shot)
- DoCheck (ongoing)
- AfterContentInit (single shot)
- AfterContentChecked	
- AfterViewInit	(single shot)
- OnDestroy	(single shot)

The goal here is to find a unified way to have single shot as well as ongoing life cycle hoost a sn observable.

### Implement any hook

**Imperative approach:**

```typescript
@Component({
  selector: 'app-child',
  template: `<p>change: {{changes | json}}</p>`
})
export class ChildComponent implements OnChanges {
   @Input()
   state;

   changes;

  ngOnChanges(changes) {
    this.changes= changes;
  }
}``` 

**Reactive approach:**
As above mentioned in section Input Decorator we **us a `ReplaySubject` to avoid timing issues** realted to life cycle hooks.
Therefor `changes$` which is 

```typescript
@Component({
  selector: 'app-child',
  template: `<p>change: {{changes$ | async | json}}</p>`
})
export class ChildComponent implements OnChanges {
  @Input() state;
   
  onChanges$ = new ReplaySubject(1);
   
  changes$ = this.onChanges$
      .pipe(map(changes => changes));

  ngOnChanges(changes) {
    this.onChanges$.next(changes);
  }
}
```

# Suggested Addons

Things suggested:
- [Push Pipe](#push-pipe) (+++)
- [Life Cycle Hooks](#Life-Cycle-Hooks) (+++)
- [Observable Compoent Bindings](#Observable-Compoent-Bindings) (++)
- [Multi Let Directive](#Multi-Let-Directive) (++)
- [Observable-Component-Bindings](#Observable-Component-Bindings) (+)
- Local State Management (+)

## Push Pipe

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

## Multi Let Structural Directive

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

# DRAFT 

# Life Cycle Hooks

To get inputs as observables is crucial for any reactive architecture. 
Also to render push based we need to depend on life-cycle hooks as an observable.

**Current Options**
- Decorators
- ViewChild

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

## Operator `selectChange`

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


# Observable Component Bindings

Observables from templates could be from following sources:

The goal is to find the most generic way for the listed sources.  
With DomEvents and CustomEvents it is already possible the exception is angular specific stuff.

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



### @Output()

**Receive events from `(stateChanged)=""`**

**Send event over `@Output() stateChanged;`**

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

As output bindings set up outside of an component can consumed over Some primitives described in capter [Observable View Events](#Observable-View-Events).



# Local State Management

A tiny logic that combines:
- values over input bindings
- Component class internal state
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
