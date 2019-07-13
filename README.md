# Proposal for a fully reactive architecture in Angular
#### 

This document is a proposal for a fully reactive architecture in Angular.
Its main goal is to serve as the glue between your reactive code and the framework.
  
Parts of Angular like the `ReactiveFromsModule`, `RouterModule`, `HttpClientModule` etc. are already reactive.
for those who prefer imperative code, it's little effort to restrict it to a simple subscription.

On the other hand for those who prefer reactive code, it's not that easy. 
A lot of conveniences is missing, and beside the `async` pipe there is pretty much nothing there to take away the manual mapping to observables. Furthermore, an increasing number of packages start to be fully observable based. A very popular and widely used example is `ngRx`. It enables us to maintain global push-based state management based on observables.

This creates even more interest and needs for reactive primitives like the `async` and other template syntax and decorators.
 
The goal would be to **give an overview** of the needs and a **suggested a set of extensions** to make it more convenient to **work in a reactive architecture**.

---
## Table of content
---
- Sections Important For Reactive Architecture
  - Observable Component Bindings
    - DomElement
    - WebComponent
    - AngularComponent
  - Observable Life Cycle Hooks
- Suggested Extensions
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

## Component Bindings

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
Some decorator that abstracts settings up the sunject and connection it with the properts. Here `ReplaySubject` is critical because of the lefe cycle hooks.

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
We use a `Subject` to retrieve the button click event and us 
**provide an observable instead of an EventEmitter for @Output()**.

Important to know is that the `EventEmitters` part of forwarding the values is not the `Observer` part (next or emit), 
it's the implementation of `Subscription`. This enables us to use an Observable and stay fully `declarative`

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
As we can directly connect an observable with the output binding there is **no need** foe an extension.

#### HostListener Decorator

**_Receive event from the host over `eventEmitter.emit(42)`_**

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
  numSubj = new BehaviorSubject(0);
  num$ = this.numSubj.pipe(scan(a => ++a));

  @HostListener('click', ['$event'])
  onCllick(e) {
    this.numSubj.next(e);
  }
}
```

**Needs:**
We would need a dacorator that abstracts away the Subject creation and connect it with the property. 
Here a configuration method similar to the one from [publish](https://github.com/ReactiveX/rxjs/blob/a9fa9d421d69e6e07aec0fa835b273283f8a034c/src/internal/operators/multicast.ts#L34) would be nice.

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

In the parent component, we can connect component properties to child component inputs over specific template syntax, the square brackets `[state]`.
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

One more downside here. If we use the `as` template syntax and have multiple observable present in the same div we run unto some annoiing situation:



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
We need a way to abstracting away the subject initialization and link an element in the view with a components property.

## Life Cycle Hooks

As the component's logic can partially rely on the components life cycle hooks we also need to consider the in-out evaluation. 

Angular fires a variety of lifecycle hooks. Some of them a single time some of them only once a components lifetime.

Angulars life cycle hooks are listed ere in order:   
(Here the Interface name is used. The implemented method starts with the prefix 'ng')
- OnChanges (ongoing, transports changes)
- OnInit (single shot)
- DoCheck (ongoing)
- AfterContentInit (single shot)
- AfterContentChecked    
- AfterViewInit (single shot)
- OnDestroy (single shot)

The goal here is to find a unified way to have single shot, as well as ongoing life cycle hooks, and observable.

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

# Suggested Extensions

Based on the above listing and thier needs we suggest a set of Angular extensions that should make it easier to setup a fully reactive architecture.

Extensions suggested:
- [Push Pipe](#push-pipe) (+++)
- [Multi Let Directive](#Multi-Let-Directive) (++)
- [Life Cycle Hooks](#Life-Cycle-Hooks) (+++)
  - [Observable Input Bindings](#Observable-Input-Bindings) (++)
  - [selectChange Operator](#selectChange-Operator) (++)
- [Local State Management](Local-State-Management) (+)

## Push Pipe

An angular pipe similar to the `async` pipe but triggers `detectChanges` instead of `markForCheck`.
This is required to run zone-less. We render on every pushed message.

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

## Multi Let Structural Directive

The multi-let directive is a not tested idea of binding multiple observables in the same view context. 

Here multiple subscriptions in the view could lead to performance issues. Unfortunately, there is no other built-in.

```html
<div *ngIf="(o1$ | push) as o1">
  <div *ngIf="(o2$ | push) as o2">
    <div *ngIf="(o3$ | push) as o3">
      <app-color 
      [color]="o1.color" [shape]="o1.shape" 
      [name]="o2.name" [age]="o2.age"
      [value]="o3">
      </app-color>  
     </div>
   <div>
</div>
```

A custom directive could probably solve it. `*multiLet="o$ | push as o; t$ | push as t;"` 
This would help the nested divs and the number of subscriptions.

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

## Observable Life Cycle Hooks

A property decorator which turnes a lifecycle method into an observable and assingnes it to the related property.

The decorator should work as aproxy for all life cycle hooks ` @hook$('onInit') onInit$;` 
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
- Single shot life cycle hooks complete after the first notification similar to http requests from `HttpClient`

### Helper Operator

**`selectChange`**

An operators `selectChange` to select a specific slice from `SimpleChange`. 
This operator can used in combination with `onChanges$`.

It also provides a very early option to control the forwarded values.

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
- optional it could have a prama for a custom comparison function


## Observable Output Bindings

A property decorator which turnes a view event into an observable and assingnes it to the related property.

The solution should work do most of his work in the component it self. 
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
- It makes it possible to subscribe to the property even before the view is renderen 
- It is multicasted to avoid multiple subscriptions
- It works with DomElements, WebComponents and AngularComponents

Here a link to a similar anlready existing idesa from [@elmd_](https://twitter.com/elmd_):
https://www.npmjs.com/package/@typebytes/ngx-template-streams

## Local State Management

A tiny logic that combines:
- values over input bindings
- The component class internal state
- state rendered to view 
- state from services.

A flexible way to query a state slice.
It considers also a late subscriber. 

Handling late subscriber is especially useful when working with lifecycle hooks.
Here values arrive over inputs and the subscription happens later in AfterViewInit. 
We normally would lose this value. 

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
