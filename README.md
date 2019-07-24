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

<!-- toc -->

- [Sections Important For Reactive Architecture](#sections-important-for-reactive-architecture)
  * [Component/Directive Bindings](#componentdirective-bindings)
    + [DomElement](#domelement)
      - [Send to property over ``](#send-to-property-over-)
    + [WebComponent](#webcomponent)
      - [Send to property over ``](#send-to-property-over--1)
      - [Receive events over `elem.addEventListener()`](#receive-events-over-elemaddeventlistener)
    + [AngularComponents](#angularcomponents)
      - [Input Decorator](#input-decorator)
      - [Output Decorator](#output-decorator)
      - [HostListener Decorator](#hostlistener-decorator)
      - [HostBinding Decorator](#hostbinding-decorator)
      - [Input Binding](#input-binding)
        * [Nested Template Scopes](#nested-template-scopes)
      - [Output Binding](#output-binding)
  * [Life Cycle Hooks](#life-cycle-hooks)
    + [Component And Directive Life Cycle Hooks](#component-and-directive-life-cycle-hooks)
    + [Service Life Cycle Hooks](#service-life-cycle-hooks)
  * [Local State](#local-state)
    + [Encapsulation and Instantiation](#encapsulation-and-instantiation)
    + [Managing the State Structure](#managing-the-state-structure)
    + [Late Subecriber](#late-subecriber)
    + [Early Producer](#early-producer)
    + [Subscription handling](#subscription-handling)
- [Sections Important For Running Zone Less](#sections-important-for-running-zone-less)
- [Needs Overview](#needs-overview)
  * [Automate Boilerplate](#automate-boilerplate)
  * [Intuitive Way To Handle Timing Issues](#intuitive-way-to-handle-timing-issues)
  * [Convenient Way To Wire Things Together](#convenient-way-to-wire-things-together)
- [Suggested Extensions](#suggested-extensions)
  * [Push Pipe](#push-pipe)
  * [Let Structural Directive](#let-structural-directive)
  * [Observable Life Cycle Hooks](#observable-life-cycle-hooks)
    + [selectChanges RxJS Operator](#selectchanges-rxjs-operator)
  * [Observable Input Bindings](#observable-input-bindings)
  * [Observable Output Bindings](#observable-output-bindings)
  * [Local State Management](#local-state-management)
    + [selectSlices RxJS Operator](#selectslices-rxjs-operator)
    + [Connection to global state management](#connection-to-global-state-management)

<!-- tocstop -->

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

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
