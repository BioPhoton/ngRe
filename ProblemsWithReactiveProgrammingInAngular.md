# General Overview of Problems with Reactive Programming

Angular in an object oriented  framework with partially reactive approaches. 
It's one of the view frameworks that allow both, functional reactive and imperative programming.  

In the last years of working and using angular I encountered several problem people ran into when working with angular.

- avoiding reactive programming 
- and leveraging reactive programming

There is also a big teaching effort in showing people that they should choose, maybe on component level, if they want to create a reactive or a imperative component. 
But in any case not mixing those two approaches! 

In the next sections I wil point out general problems on which people ran into most.

## How to Avoid Reactive Programming

If you DON'T want to use a reactive approach in your component you 
should subscribe as soon as possible to the stream you want to get rid of and do following things:
- subscribe to a stream and assign incoming values to a component property 
- unsubscribe the stream as soon as the component gets destroyed 

To elaborate with some more practical things we start with a part of angular that provides reactivity and try to avoid it.

### Retrieving a single router-param and render it

Let's solve a real-live problem in a very primitive way first. 
Retrieving the route params, plucking out a single key and displaying it's value in the view.

We start with the reactive approach first and then try to convert it into an imperative approach.

**Reactive Approach** 
```typescript
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';

@Component({
  selector: 'my-component',
  template: `
    Route Param Id: {{id | async}}
  `
})
export class AppComponent {
  id;

  constructor(private router: ActivatedRoute) {
    this.id = router.params
      .pipe(map(params => params.id));
  }
}
```
3 Things happen here:
- retrieving the new route params 
- deriving the values from the `id` param with a transformation operation 
  by using the `map` operator
- by using the `acync` pipe we:
  - subscribe to the observable on `afterViewInit`
  - applying the the internal value the the next pipe return value
 
 
 constructor
 ngOnChanges
 ngOnInit
 ngAfterContentInit
 ngAfterContentChecked
 Subscription
 ngAfterViewInit
 ngAfterViewChecked
 ngOnDestroy 

## General Timing Issues

As a lot of problems are related to timing issues this section is here to give a comülete overview of all the different types of issues. 

Two different problems are occurring in multiple different situations:
- Late Subscriber Problem
- Early Producer Problem

### The Late Subscriber Problem

Incoming values arrive before the subscription has happened.

For example state over `@Input()` decorators arrives before the view gets rendered and a used pipe could receive the value.

```typescript
@Component({
  selector: 'app-late-subscriber',
  template: `
    {{state$ | async | json}}
  `
})
export class LateSubscriberComponent {
  state$ = new Subject();
  
  @Input()
  set state(v) {
    this.state$.next(v);
  }

}
```

We call this situation late subscriber problem. In this case, the view is a late subscribe to the values from '@Input()' properties.
There are several situations from our previous explorations that have this problem:
- [Input Decorators](Input-Decorators)
  - transporting values from `@Input` to `AfterViewInit` hook
  - transporting values from `@Input` to the view
  - transporting values from `@Input` to the constructor 
- [Component And Directive Life Cycle Hooks](Component-And-Directive-Life-Cycle-Hooks)
  - transporting `OnChanges` to the view
  - getting the state of any life cycle hook later in time (important when hooks are composed)
- [Local State](Local-State)
  - transporting the current local state to the view
  - getting the current local state for other compositions

**Solutions**

All those problems boil down to 2 different solutions depending on the particular problem.
- using `ReplaySubjects` with `bufferSize` of `1` to cache the latest sent value
- using `shareReplay` for referential sharing as shown in [Sharing References over Observables](Sharing-References-over-Observables)


### The Early Producer Problem

The subscription happens before any value can arrive.

For example, subscriptions to view elements the constructor happen before they ever exist.
We call this situation early subscriber problem. In this case, the component constructor is an early subscribe to the events from '(click)' bindings. 

All above decorators should rely on a generic way of wrapping a function or property as well as a way
to configure the used Subject for multi-casting similar to [multicast](https://github.com/ReactiveX/rxjs/blob/a9fa9d421d69e6e07aec0fa835b273283f8a034c/src/internal/operators/multicast.ts#L34)

In this way, it is easy to have a simplified public API but flexibility internally.

**Decorators that:**
- rely on configurable multi-casting similar to `multicast` operator.
  this provides a generic configurable way for all cases 
---

## Sharing references 

TBD
