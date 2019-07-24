# Proposal for a fully reactive/zone-less architecture in Angular
#### 

This document is a proposal for a fully reactive architecture in Angular.
Its main goal is to serve as the glue between your reactive code and the framework.
  
Parts of Angular like the `ReactiveFromsModule`, `RouterModule`, `HttpClientModule` etc. are already reactive.
for those who prefer imperative code, it's little effort to restrict it to a simple subscription.

On the other hand for those who prefer reactive code, it's not that easy. 
A lot of conveniences is missing, and beside the `async` pipe there is pretty much nothing there to take away the manual mapping to observables. Furthermore, an increasing number of packages start to be fully observable based. A very popular and widely used example is `ngRx`. It enables us to maintain global push-based state management based on observables.

This creates even more interest and for reactive primitives like the `async` and other template syntax and decorators.
 
The goal would be to **give an overview** of the needs and a **suggested a set of extensions** to make it more convenient to **work in a reactive architecture**.

---
## Table of content
---
- [Sections Important For Reactive Architecture](#sections-important-for-reactive-architecture)
  * [Component/Directive Bindings](#component-directive-bindings)
    + [DomElement](#domelement)
      - [Send to property over `<elem attr=""></elem>`](#send-to-property-over---elem-attr------elem--)
    + [WebComponent](#webcomponent)
      - [Send to property over `<elem attr=""></elem>`](#send-to-property-over---elem-attr------elem---1)
      - [Receive events over `elem.addEventListener()`](#receive-events-over--elemaddeventlistener---)
    + [AngularComponents](#angularcomponents)
      - [Input Decorator](#input-decorator)
      - [Output Decorator](#output-decorator)
      - [HostListener Decorator](#hostlistener-decorator)
      - [HostBinding Decorator](#hostbinding-decorator)
      - [Input Binding](#input-binding)
      - [Output Binding](#output-binding)
  * [Life Cycle Hooks](#life-cycle-hooks)
    + [Component And Directive Life Cycle Hooks](#component-and-directive-life-cycle-hooks)
    + [Service Life Cycle Hooks](#service-life-cycle-hooks)
  * [Local State](#local-state)
    + [Late Subecriber](#late-subecriber)
    + [Encapsulate Statemanagement (move to service)](#encapsulate-statemanagement--move-to-service-)
    + [Managing Component State (the state object)](#managing-component-state--the-state-object-)
    + [Late Subecriber](#late-subecriber-1)
    + [Early Producer](#early-producer)
- [Sections Important For Running Zone Less](#sections-important-for-running-zone-less)
- [Needs Overview](#needs-overview)
  * [Automoate Boilerplate](#automoate-boilerplate)
  * [Intuitive Way To Handle Timing Issues](#intuitive-way-to-handle-timing-issues)
  * [Convenient Way To Wire Things Together](#convenient-way-to-wire-things-together)
- [Suggested Extensions](#suggested-extensions)
  * [Push Pipe](#push-pipe)
  * [Multi Let Structural Directive](#multi-let-structural-directive)
  * [Observable Life Cycle Hooks](#observable-life-cycle-hooks)
    + [selectChange RxJS Operator](#selectchange-rxjs-operator)
  * [Observable Input Bindings](#observable-input-bindings)
  * [Observable Output Bindings](#observable-output-bindings)
  * [Local State Management](#local-state-management)
    + [selectSlice RxJS Operator](#selectslice-rxjs-operator)

---

# Sections Important For Reactive Architecture

Here we will try to list all areas in angular where such helper primitives would be needed. 
The first step is to list all possible situations and a very simple solution for a reactive approach.
Each area may have different requirements to be more convenient to use in a reactive way. 

Every section explains the current _imperative_ approach as well as the _reactive_ approach in a simple way.
This should help to understand the problems and get a good overview of the options and needs for a reactive architecture in angular.

Based on the collected information we can try to use the explored options to create an elegant solution for the explored needs.

Following topics are documented below:
- Component Bindings
- Life Cycle Hooks

## Component/Directive Bindings

As the main requirement for a reactive architecture in current component-oriented 
frameworks are handling properties and events of components.

The goal here is to find a unified way to have properties and events as observables integrated into angular.

Here we discuss 3 different types we consider: 
- DomElement
- WebComponent
- AngularComponent


### DomElement

DomElements is everything you can query from `document`.

The goal is to list vanilla js versions as well as the angular way and list options on how to make property values and events working with angular.

#### Send to property over `<elem attr=""></elem>`

To set a value for an input attribute you can query the dom get the item and set the value.

```typescript
const elem = document.getElementById('elem-1');
const elem.value = 42;        
```

This case is easy to cover in a general case as there are many 
built-in directives that enable us to set attributes on elements with angular.

**Imperative approach:**

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

**Reactive approach:**

Angular provides a set of decorators for all standard dom attributes. 
This the suggested way to go and explained in detail in the AngularComponent section.  

**Reactive approach:**

```typescript
const elem = document.getElementById('elem-1');
fromEvent(elem, 'click')
  .subscribe(e => {
    console.log('click event:', e);
  });
``` 

**Needs:**   
As Angular covered this already this section can be ignored for the suggested extensions.

### WebComponent 

The goal is to list vanilla js versions as well as the angular way and list options on how to make property values and events working with angular.

#### Send to property over `<elem attr=""></elem>`  

**Imperative approach:**
```typescript
TBD
```

**Reactive approach:**
```typescript
TBD
```

**Needs:**   
TBD

#### Receive events over `elem.addEventListener()`

**Imperative approach:**
```typescript
TBD
```

**Reactive approach:**
```typescript
TBD
```

**Needs:**   
TBD

### AngularComponents

In angular, we have an equivalent to properties and events, _input_ and _output_ bindings_.
But we also have several other options for available to interact with components.

The goal is to list all features in angular that interfere with Component Bindings or similar and provide an imperative as well as a reactive approach for each option.

We consider the following decorators:
- Input Decorator
- Output Decorator
- HostListener Decorator 
- HostBinding Decorator

And consider the following bindings:
- Input Binding
- Output Binding

#### Input Decorator

Inside of a component or directive we can connect properties with the components in it bindings over the `@Input()` decorator.
This enables us to access the values of the incoming in the component. 

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

Here we have to consider to cache the latest value from state-input binding.
As changes fires before AfterViewInit, we normally would lose the first value sent. Using some caching mechanism prevents this.
Furthermore and most importantly **this makes it independent from the lifecycle hooks**.

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

Some decorator that **automates the boilerplate** of settings up the subject and connection it with the property.   
Here `ReplaySubject` is critical because of the life cycle hooks. 
`@Input` is fired first on `OnChange` where the first moment where the view is ready would be `AfterViewInit`

> **Boilerplate Automation**   
> For every binding following steps could be automated:
> - setting up a `Subject`
> - hooking into the `setter` of the input binding and `.next()` the incoming value

> **Early Producer**   
> All input bindings are so called "early producer". A cache mechanism is needed as followed:
> - Use a `ReplaySubject` with `bufferSize` of `1` to emmit notifications

--- 

#### Output Decorator

**_Send event over `eventEmitter.emit(42)`_**

Inside of a component or directive, we can connect events with the components output bindings over the `@Output()` decorator.
This enables us to emit values to its parent component. 

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

Here we change 2 things.
We use a `Subject` to retrieve the button click event and 
**provide an observable instead of an EventEmitter for @Output()**.

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
No need for an extension.

> **No need for custom extensions**   
>  Due to the fact that we can also provide an `Observable` as `EventEmitters` there is **no need for as extension**


---   


#### HostListener Decorator

**_Receive event from the host over `@HostListener('click', ['$event'])`_**

Inside of a component or directive, we can connect host events with a component method over the `@HostListener()` decorator.
This enables us to retrieve the host's events. 

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
  numSubj = new Subject();
  num$ = this.numSubj.pipe(scan(a => ++a));

  @HostListener('click', ['$event'])
  onCllick(e) {
    this.numSubj.next(e);
  }
}
```

**Needs:**   

We would need a decorator **automates the boilerplate** of the `Subject` creation and connect it with the property. 
As `subscriptions` can occour earlier than the `Host` could send a value we speak about "early supscribers". 
This problem can be solved as the subject is created in with instance construction.

> **Boilerplate Automation**   
> For every binding following steps could be automated:
> - setting up a `Subject`
> - hooking into the `setter` of the input binding and `.next()` the incoming value

> **Early Supscribers**   
> Make sure the created `Subject` it present early enough in time

---   

#### HostBinding Decorator

**_Receive property changes from the host over `@HostBinding('class')`_**

Inside of a component or directive, we can connect the DOM attribute as from the host with the component property. 
Angular automatically updates the host element over change detection.
In this way, we can retrieve the host's properties changes.


**Imperative approach:**

```typescript
@Component({
  selector: 'app-child',
  template: `<p>color: {{className}}</p>`,
})
export class ChildComponent  {
  className = 'visible';
  
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

**Provide an observable** instead of a function.

Here again we would need a decorator that **automates** the `Subject` creation and connection. 
As subscriptions can occour earlier than the `Host` could be ready we speak about "early supscribers". 
This problem can be solved as the subject is created in with instance construction.

> **Boilerplate Automation**   
> For every binding following steps could be automated:
> - setting up a `Subject`
> - hooking into the `setter` of the input binding and `.next()` the incoming value

> **Early Supscribers**   
> Make sure the created `Subject` it present early enough in time


---   


#### Input Binding 

**_Send value changes to child compoent input `[state]="state"`_**

In the parent component, we can connect component properties to the child
component inputs over specific template syntax, the square brackets `[state]`.
Angular automatically updates the child component over change detection.
In this way, we can send component properties changes.

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
We cal rely on trust that subscription to `state$` happens after `AfterViewInit`.


> **Inconsistent handling of undefined variables**   
> It is important to mention the inconsistant handling of undefined variables and observables that didnt send a value yet. 

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
As we know exactly when changes happen we can trigger change detection manually. Knowing the advantages of subscriptions over the template and lifecycle hooks the solution should be similar to `async` pipe.

> **NgZone could be detached**   
> As all changes can get detected we could detache the pipe from the `ChangeDetection` and trigger it on every value change

> **Implement strick and consistent handling of undefined for pipes**   
> A pipe similar to `async` that should act as following:
> - when initially passed `undefined` the pipe should forward undefined as value as on value ever was emitted
> - when initially passed `null` the pipe should forward undefined as value as on value ever was emitted
> - when initially passed `of(undefined)` the pipe should forward undefined as value as `undefined` was emitted
> - when initially passed `of(null)` the pipe should forward undefined as value as `null` was emitted
> - when initially passed `EMPTY` the pipe should forward undefined as value as on value ever was emitted
> - when initially passed `NEVER` the pipe should forward undefined as value as on value ever was emitted
> - when reassigned a new `Observable` the pipe should forward undefined as value as on value was emitted from the new `Observable`


##### Nested Template Scopes   
One more downside here. If we use the `as` template syntax and have multiple observable presents in the same div we run into some   
annoying situation where we have to nest multiple divs to have a context per bound vairable.

**Nested Template Scope Problem**
```html
<div *ngIf="(observable1$ | async) as color">
  <div *ngIf="(observable2$ | async) as shape">
    <div *ngIf="(observable3$ | async) as name">
      <app-color 
        [color]="color" [shape]="shape" [name]="name">
  	  </app-color>  
     </div>
   <div>
</div>
```

**Getting rid of Nested Div Problem**
```html
<ng-container *ngIf="observable1$ | async as color">
  <ng-container *ngIf="observable2$ | async as shape">
    <ng-container *ngIf="observable3$ | async as name">
      <app-color 
        [color]="color" [shape]="shape" [name]="name">
  	  </app-color>  
     </ng-container>
   <ng-container>
</ng-container>    
```

**Possible Solutions**
```html
<ng-container *ngIf="{
              color: observable1$ | async,
              shape: observable2$ | async,
              name:  observable3$ | async
            } as c">
  <app-color [color]="c.color" [shape]="c.shape" [name]="c.name">
  </app-color>  
</ng-container>
```

**Needs:**   
Bringing it together into one object helps a lot. The syntax could be more convenient. Furthermore we could implement some default behaviour for falsy falues.

> **Implement more convenient binding syntax**   
> To improve usability we should fulfill following:
> - the context should be always present. `*ngIf="{}"` would do that already
> - controlled change detection to run zone-less
> - avoid multiple usage of the `async`pipe
> - better control over the context. Maybe we could get rid of the `as` as variable??
> - implement an internal layer to handle null vs undefined etc
> - implement option to put attitional logic for complete and error of an observable

---   

#### Output Binding 

**_Receive events from child compoent over `(stateChange)="fn($event)"`_**

In the parent component, we can receive events from child components over specific template syntax, the round brackets `(stateChange)`.
Angular automatically updates fires the provides function over change detection.
In this way, we can receive component events.

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
As it is minimal overhead we can stick with creating a `Subject` on our own.

> **No need for custom extensions**   
>  Due to the fact of the minimal overhrad and the resources of creating a custom `Decorator` for it there **no need for as extension**

---   

## Life Cycle Hooks

As the component's logic can partially rely on the components life cycle hooks we also need to consider the in-out evaluation. 

Angular fires a variety of lifecycle hooks. Some of them a single time some of them only once a components lifetime.

Angulars life cycle hooks are listed ere in order:   
(Here the Interface name is used. The implemented method starts with the prefix 'ng')
- OnChanges (ongoing, transports changes)
- OnInit (single shot)
- DoCheck (ongoing)
- AfterContentInit (single shot)
- AfterContentChecked (ongoing)
- AfterViewInit (single shot)
- AfterViewChecked (ongoing)
- OnDestroy (single shot)

The goal here is to find a unified way to have single shot, as well as ongoing life cycle hooks, and observable.

### Component And Directive Life Cycle Hooks

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
}
``` 

**Reactive approach:**   
As above mentioned in section Input Decorator we **us a `ReplaySubject` to avoid timing issues** related to life cycle hooks.
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

**Needs**   
We need a decorator to **automates the boilerplate** of the `Subject` creation and connect it with the property away. 

Also `subscriptions` can occour earlier than the `Host` could send a value we speak about "early supscribers". 
This problem can be solved as the subject is created in with instance construction.

> **Boilerplate Automation**   
> For every binding following steps could be automated:
> - setting up a `Subject`
> - hooking into the `setter` of the input binding and `.next()` the incoming value

> **Late Supscribers**   
> - As subscriptions could happen before values are present (subscribing to `OnInit` in constructor) 
>   we have to make sure the Subject is creates early enough in time for all life cycle hooks

> **Early Producer**   
> - As subscriptions could happen later in time we could lose values (subscribing to `OnChanges` in `OnInit`)
>   A cache mechanism which uses `ReplaySubject` with `bufferSize` of `1` is needed for following hooks:
> - OnChanges
> - DoCheck
> - OnInit
> - AfterContentChecked
> - AfterViewChecked

---   

### Service Life Cycle Hooks

In general services are global or even when lazy loaded the are not unregistered at some point in time.
The only exception are Services in the `Components` `providers` and ´viewProviders´ section.
Threr parts od the services logic could rely on the life of the service, which it exactly the life tiime of the component. 

Angular for suh scenarios angular profides the `OnDestroy` life cycle hook for classes decorated with `@Injectable`.

The goal here is to find a unified way to have the services `OnDestroy` life cycle hooks as observable.

**Imperative approach:**   

```typescript
@Component({
  selector: 'app-child',
  template: ``,
  providers: [LocalProvidedService]
})
export class ChildComponent implements OnChanges {
  constructor(private s: LocalProvidedService) {
  }
}

export class LocalProvidedService implements OnDestroy {
  
  constructor() {
  }

  ngOnDestroy(changes) {
    console.log('LocalProvidedService OnDestroy');
  }
}
``` 

**Reactive approach:**   

```typescript
@Component({
  selector: 'app-child',
  template: ``,
  providers: [LocalProvidedService]
})
export class ChildComponent implements OnChanges {
  constructor(private s: LocalProvidedService) {
  }
}
@Injctable({
  providedIn: 'root'
})
export class LocalProvidedService implements OnDestroy {
  onDestroy$ = new Subject();
   
  constructor() {
     this.onDestroy$subscribe(_ => console.log('LocalProvidedService OnDestroy');)
  }

  ngOnDestroy(changes) {
    this.onDestroy$.next();
  }
}
```

**Needs**   
We need a decorator to **automates the boilerplate** of the `Subject` creation and connect it with the property away. 

> **Boilerplate Automation**   
> For every binding following steps could be automated:
> - setting up a `Subject`
> - hooking into the `setter` of the input binding and `.next()` the incoming value

---   

## Local State

### Encapsulation and Instantiation

The goal here is to evaluate aproaches of encapsulating statemanagement into a service. 
As this is trivial in angular we directly go to the example.

**Simple approach:**   

```typescript
@Component({
  selector: 'app-child',
  template: ``,
  providers: [LocalProvidedService]
})
export class ChildComponent implements OnChanges {
  constructor(private localStateService: LocalStateService) {
    this.localStateService.next(42);
  }
}

@Injctable({
  providedIn: 'root'
})
export class LocalProvidedService implements OnDestroy {
  subject = new Subject();
  
  next(value) {
    this.subject.next(value);
  }
}
```

**Needs**   
As Angular already provides a DI layer ther is nothing to solve here

---   

### Managing the State Structure

The goal here is to come up with a good slim solution for managing the conponents state as a object.
The state should be immutable by default and easy to change and receive changes.

**Simple approach:**   

```typescript
@Component({
  selector: 'app-child',
  template: `
    <button (click)="increment()">click</button>
    state: {{state$ | async | json}}
  `
})
export class ChildComponent implements OnChanges {
  command$ = Subject();
  
  state$ = this.command$
    .pipe(
      scan((state, command) => ({...state, ...command}), {})
    );

  increment() {
    this.command$.next({value: 1})  
  } 
}
```

**Needs**   
We need to manage the components state as an object. The logic should make immutable changes so we don't have care about it.
State should be easy to receive and change to the state should be able with as minimal code as possible.

> **Manage state as an object**  
> Form the above explorations following things are needed to organize our state
> - an object to identify every stored value over a key
> - setup a `Subject` to have the observers `.next()` methode available to send values
> - accumulate the values in an object over the `scan` operator
> - at least immutable changes to the shalow 
>   done by i.e. the TypeScript spread operator `...` should be automated by the logic
> - having a layer of validation for the commands

---   

### Late Subecriber

Situations where interested parties join a part of your application later on in time are called late subscribers. 
Some meaningful examples could be:
- the view is a late subscriber to stuf happening in the `constructor` or in the `ngOnChanges` method.
- any component is a late subscriber to a stateful service

Such situations are handeled over getter in imperative programming. In reactive programming we solve this over thin caching layer.

**Problem of beeing too late**
```typescript
@Component({
  selector: 'app-late-subscriber',
  template: `
    <h2>Late Subscriber Child</h2>
    {{state$ | async | json}}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LateSubscriberComponent {
  state$ = new Subject();
  
  @Input()
  set state(v) {
    this.state$.next(v);
  }

}
```

**Replaiing latest (n) values**
```typescript
@Component({
  selector: 'app-late-subscriber',
  template: `
    <h2>Late Subscriber Child</h2>
    {{state$ | async | json}}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LateSubscriberComponent {
  state$ = new Subject();
  
  @Input()
  set state(v) {
    this.state$.next(v);
  }
}
```

**Needs**   

We need to abstract timing issues away from the consumer. In the case of late subscribers it is easily possible with sbjects like `BehaviorSubject` or `ReplaySubject` or operators like `share` or `shareReplay`.


> **Caching latest Values**
> - use `ReplaySubject` to cache the latest (n) values. In most of the cases this is the way to go.
> - there are rare cases where we want to use an initial value and are not able to use `startWith`, here a `BehaviorSubject` can be used 
> - In cases where we have no control of the source we can also use `shareReplay`
> - In stateful services the replayed values are always limited to `1`. The actual value and all future onse.

--- 

### Early Producer

Situations where we have early producers are things where we have values produces and transported over _cold_ Observables. In this case, as we have no subscriber yet on the mentioned Observable, we are loosing all values until the first subscriber. 

The goal would be to find a solution that can get encapsulated and abstracted away from the actual code.

**Problem of early production**
```typescript
@Component({
  selector: 'app-early-producer',
  template: `
    {{state$ | async | json}}
  `
})
export class LateSubscriberComponent {
  command$ = new Subject();
  state$ = this.command
    .pipe(
      scan((s,c)=>({...s,...c}), {})
    );
  
  @Input()
  set state(v) {
    this.command$.next(v);
  }
  
  constructor() {
    this.state = {slice1: 7};
    this.state = {slice2: 42};
  }
}
```

**Making the accumulation hot**
```typescript
@Component({
  selector: 'app-late-subscriber',
  template: `
    <h2>Late Subscriber Child</h2>
    {{state$ | async | json}}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LateSubscriberComponent {
  command$ = new Subject();
  state$ = this.command
    .pipe(
      scan( (s,c) => ({...s,...c}), {} ),
      publish()
    );
  
  @Input()
  set state(v) {
    this.command$.next(v);
  }
  
  constructor() {
    this.state.connect();

    this.state = { slice1: 7 };
    this.state = { slice2: 42 };
  }
}
```
**Needs**   
We need to have the observable to be hot with component constructor. Additional pipes or similar should be abstractedd away.

> **Providing State as Hot**
> To ensure all values get processed we need to:
> - call the `.connect()` from a `publish` method at component construction
> - use `publishReplay(1)` to privide state for late suscriber

---

### Subscription handling

Normally we use the components lifecycle to subscribe and unsubscribe from certian observables in the component.
We already know some solutions for getting a clean and elegant subscription handling by turning OnDestroy into an Observable. 
But it still feels a bit repetetive. Furthermore it is up to the user to do subscription handling right.
 
The goal would be to find a way to move subscription hadling outside of the component code.

**Subscription Handling Inside of Component**
```typescript
@Component({
  selector: 'app-early-producer',
  template: ``
})
export class LateSubscriberComponent {
  ngOnDestroy$ = new Subject();
  command$ = new Subject();
  state$ = this.command
    .pipe(
      scan( (s,c) => ({...s,...c}), {} ),
      publish()
    );
  
  constructor() {
    this.state$
    .pipe(takeUntil(this.ngOnDestroy$))
    .subscribe(console.log);
  }
  
  ngOnDestroy() {
    this.ngOnDestroy$.next();
  }
  
}
```

**Subscription Handling over View Provider**
```typescript
@Component({
  selector: 'app-early-producer',
  template: ``,
  providers: [LocalStateService]
})
export class LateSubscriberComponent implements OnDestroy {
   
  constructor(private localState: LocalStateService) {
    this.localState.state$
    .subscribe(console.log);
  }
 
}

class LocalStateService implements OnDestroy {
   ngOnDestroy$ = new Subject();
   
   command$ = new Subject();
   state$ = this.command
    .pipe(
      scan( (s,c) => ({...s,...c}), {} ),
      publish()
    );
  
    ngOnDestroy() {
      this.ngOnDestroy$.next();
    }
}
```

**Needs**   
We need to find a elegant way of controling subscriptions in a component.

> **Automated subscription handling**
> To ensure all subscriptions are cleaned up we need to:
> - encapsulate state managed in the component into a service 
> - leverage the services `OnDestroy` life cycle hook to handle subscription inside the service
> - provide it under the components providers to bind it's lifetime to the components lifetime
> - use dependency injection us instanciate the service with component construction

---

# Sections Important For Running Zone Less

# Needs Overview

## Automoate Boilerplate

Automate boilerplate of setting up a subject and connecting it to producer.

Here a configuration method for the type of `Subject` similar to the one from [multicast](https://github.com/ReactiveX/rxjs/blob/a9fa9d421d69e6e07aec0fa835b273283f8a034c/src/internal/operators/multicast.ts#L34) would be nice.

In a majority of the cases, there was a need for abstracting away the boilerplate of setting up a subject and connecting it to the producer. A normal `Subject` was used in most of the cases. Some cases used a `ReplaySunject` or `BeHaviorSubject` to initialize the value. This was used to provide the latest value for a new subscriber. 

Here we think one or many component property/method decorator can help. 

**Decorators that:**
- automatically use the right caching strategy i.e. replay
- getter is hot by after the decorator fires i.e. subscription possible without considering life cycle hooks
- setter accepts observables as values i.e. connecting a reactive radio group directly to a style property 

---

## Intuitive Way To Handle Timing Issues

As timing and multicasting is anyway a complex topic we should make it easy for the consumer of these extensions to use them. 

There are two problems:
- Late Subscriber Problem
- Early Subscriber Problem

_Late Subscriber Problem:_
**There is already a subscription** Incoming values arrive before the has happened subscription. 

For example state over input bindings arrives before the view gets rendered and a used pipe could receive the value.
We call this situation late subscriber problem. In this case, the view is a late subscribe to the values from '@Input()' properties.

_Early Producer Problem:_
The subscription happens before any value can arrive.

For example, subscriptions to view elements the constructor happen before they ever exist.
We call this situation early subscriber problem. In this case, the component constructor is an early subscribe to the events from '(click)' bindings. 

All above decorators should rely on a generic way of wrapping a function or property as well as a way
to configure the used Subject for multicasting similar to [multicast](https://github.com/ReactiveX/rxjs/blob/a9fa9d421d69e6e07aec0fa835b273283f8a034c/src/internal/operators/multicast.ts#L34)

In this way, it is easy to have a simplified public API but flexibility internally.

**Decorators that:**
- rely on configurable multicasting similar to `multicast` operator.
  this provides a generic configurable way for all cases 
---


## Convenient Way To Wire Things Together
As discussed in [Automoate boilerplate](#Automoate-boilerplate) a lot of things that are related to angular can be solved by the right decorator. But there are other areas where we need to provide some solutions. A more general one than just life cycle hooks of a single component. 

The problem of connecting all component bindings, global state, locally provided services, view events and 
The main reason here is getting the values over View elements that are instantiated later.

TBD

# Suggested Extensions

Based on the above listing and their needs we suggest a set of Angular extensions that should make it easier to set up a fully reactive architecture.

Extensions suggested:
- Push Pipe
- Multi Let Structural Directive
- Observable Life Cycle Hooks
  - Helper Operator
- Observable Input Bindings
- Observable Output Bindings
- Local State Management
  - Helper Operator

## Push Pipe

An angular pipe similar to the `async` pipe but triggers `detectChanges` instead of `markForCheck`.
This is required to run zone-less. We render on every pushed message.
(currenty there in an [isssue](https://github.com/angular/angular/issues/31438) with the `ChangeDetectorRef` in ivy so we have to wait for the fix=

The pipe should work as template binding `{{thing$ | push}}` 
as well as input binding `[color]="thing$ | push"` and trigger the changes of the host component.

```html
<div *ngIf="(thing$ | push) as thing">
  color: {{thing.color}}
  shape: {{thing.shape}}
<div>

<app-color [color]="(thing$ | push).color">
</app-color>
```

## Let Structural Directive

The multi-let directive is a not tested idea of binding multiple observables in the same view context. 

Here multiple subscriptions in the view could lead to performance issues. Unfortunately, there is no other built-in solution for that.

```html
<ng-container *ngIf="{
              color: observable1$ | async,
              shape: observable2$ | async,
              name:  observable3$ | async
            } as c">
  <app-color [color]="c.color" [shape]="c.shape" [name]="c.name">
  </app-color>  
</ng-container>
```

A custom directive could probably solve it. `*let="{o: o$, t: t$} as s;"` 
This would help the nested divs and the number of subscriptions.

```html
<ng-container *let="{
              color: observable1$,
              shape: observable2$,
              name:  observable3$
            } as c">
  <app-color 
    [color]="c.color" [shape]="c.shape" [name]="c.name">
  </app-color>  
</ng-container>
```

## Observable Life Cycle Hooks

A property decorator which turns a lifecycle method into an observable and assigns it to the related property.

The decorator should work as a proxy for all life cycle hooks ` @hook$('onInit') onInit$;` 
as well as forward passed values i.e. `changes` in from the `OnChanges` hook.

```typescript
  @hook$('onInit') onInit$;
  @hook$('onDestroy') onDestroy$;

  this.onInit$
    .pipe(
      switchMapTo(interval(1000)),
      map(_ => Date.now()),
      takeUntil(this.onDestroy$)
    )
    .subscribe();
```

Following things are done under the hood:
- It uses a caching method like `ReplaySubject` does to handle late subscribers.
- The property i.e. `onInit$` gets an observable assigned, not a subject.
- Single-shot life cycle hooks complete after the first notification similar to HTTP requests from `HttpClient`

### selectChange RxJS Operator


An operators `selectChange` to select a specific slice from `SimpleChange`. 
This operator can be used in combination with `onChanges$`.

It also provides a very early option to control the forwarded values.

**Example of selectSlice operator**
```typescript
export class MyComponent {
  @hook$('onChanges') 
  onChanges$: Observable<SimpleChanges>;

  @Input() state;
  state$ = this.onChanges$.pipe(getChange('state'));
}
```

Following things are done under the hood:
- pull out `currentValue` from `SimpleChanges` object
- optional it could have a parma for a custom comparison function

## Observable Input Bindings

A property decorator which turns component or directive input binding into an observable and assigned it to the related property.

```typescript
@Component({
  selector: 'app-child',
  template: `<p>input: {{input$ | async}}</p>`,
})
export class ChildComponent  {
  @Input$()
  input$;
}
```

Following things are done under the hood:
- It caches to consider late subscribers (life cycle hook related) 
- It is multicasted to avoid multiple subscriptions
- It works with WebComponents and AngularComponents

## Observable Output Bindings

A property decorator which turns a view event into an observable and assigns it to the related property.

The solution should work do most of his work in the component itself. 
Only a small piece in the template should be needed to link the view with the component property.

```typescript
@Component({
  selector: 'app-child',
  template: `<button #elem">clicks: {{count$ | async}}</button>`,
})
export class ChildComponent  {
  @FromView$('#elem', 'click')
  click$;
  
  count$ = this.click$.pipe(scan(a => ++a, 0));
}
```

Following things are done under the hood:
- It makes it possible to subscribe to the property even before the view is rendered 
- It is multicasted to avoid multiple subscriptions
- It works with DomElements, WebComponents, and AngularComponents

Here a link to a similar already existing ideas from [@elmd_](https://twitter.com/elmd_):
https://www.npmjs.com/package/@typebytes/ngx-template-streams

## Local State Management

This extension is maybe the most interesting one. While we can 

A tiny logic that combines:
- values over input bindings
- The component class internal state
- state rendered to view 
- state from services.

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

### selectSlice RxJS Operator

A flexible way to query a state slice.
It considers also a late subscriber. 

An operators `selectSlice` to select a specific slice from the managed state. 
This operator can be used to get slices from `this.lS$`.

```typescript
buttons$ = this.lS.state$
  .pipe(
    selectChange(['state', 'substate'])
  );
```

Following things are done under the hood:
- it handles late subscribers with `shareReplay(1)` 
- it forwards only distinct values

### Connection to global state management

TBD
