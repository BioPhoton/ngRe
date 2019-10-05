# How to Avoid Observables in Angular

![](https://github.com/BioPhoton/ngRe/raw/master/avoid-observables-cover.png "How to Avoid Observables in Angular - Cover")

Angular is an object-oriented framework. 
Even if there are a lot of things imperative some services and therefore also some third party libs, are reactive. 
This is great because it provides both approaches in one framework, which is at the moment a more or less unique thing.

As reactive programming is hard for an imperative thinking mind, many people try to avoid reactive programming.
This article will help you to understand how to avoid it and why it is even here at all.

<!-- toc -->

- [Comparing Basic Usecases](#comparing-basic-usecases)
  * [Retrieving data over HTTP](#retrieving-data-over-http)
  * [Retrieving values provided by Angular](#retrieving-values-provided-by-angular)
  * [Retrieving values provided by third parties](#retrieving-values-provided-by-third-parties)
- [Patterns to avoid observables](#patterns-to-avoid-observables)
  * [Where to subscribe](#where-to-subscribe)
  * [Make it even easier](#make-it-even-easier)
- [The reason for reactive programming](#the-reason-for-reactive-programming)
  * [Comparing composition](#comparing-composition)
- [Summary](#summary)

<!-- tocstop -->

If you **DON'T** want to use a reactive approach in your component you 
should subscribe as soon as possible to the stream you want to get rid of and do the following things:
- subscribe to a stream and assign incoming values to a component property 
- if necessary, unsubscribe the stream as soon as the component gets destroyed 

To elaborate with some more practical things we start with a part of angular that provides reactivity and try to avoid it.

## Comparing Basic Usecases

In this section, we will get a good overview of some of the scenarios we get in touch with reactive programming in Angular.

We will take a look at:
- Reactive services provided by Angular
- Cold and Hot Observables
- Subscription handling

And see the reactive and imperative approach in comparison.

### Retrieving values from cold observables

Let's solve a very primitive example first. 
Retrieving data over HTTP and render it.

![](https://github.com/BioPhoton/ngRe/raw/master/ex1-http.png "Retrieving values from cold observables")


We start with the reactive approach and then try to convert it into an imperative approach.

**Leveraging Reactive Programming** 
```typescript
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'example1-rx',
  template: `
  <h2>Example1 - Leverage Reactive Programming</h2>
  Http result: {{result | async}}
  `
})
export class Example1RxComponent  {
  result;

  constructor(private http: HttpClient) {
    this.result = this.http.get('https://api.github.com/users/ReactiveX')
      .pipe(map((user: any) => user.login));
  }

}
```

Following things happen here:
- subscribing to `http.get` by using the `async` pipe triggers:
  - a HTTP `get` request fires
  - we retrieve the result in the pipe and render it

On the next change detection run, we will see the latest emitted value in the view.

As observables from `HttpClient` are cold and they complete after the first emission we don't care about subscription handling here.

**Avoid Reactive Programming** 
```typescript
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'example1-im',
  template: `
  <h2>Example1 - Avoid Reactive Programming</h2>
  Http result: {{result}}
  `
})
export class Example1ImComponent {
  result;

  constructor(private http: HttpClient) {
    this.result = this.http.get('https://api.github.com/users/ReactiveX')
      .subscribe((user: any) => this.result = user.login);
  }

}
```

Following things happen here:
- subscribing to `http.get` in the constructor triggers:
  - a HTTP `get` request fires
  - we retrieve the result in subscribe function

On the next change detection run, we will see the result in the view.

As observables from `HttpClient` are cold and they complete after the first emission we don't care about subscription handling here.

### Retrieving values from hot observables provided by Angular

Next, let's use a hot observable provided by angular the router params.

Retrieving the route params, plucking out a single key and displaying its value in the view.

![](https://github.com/BioPhoton/ngRe/raw/master/ex2-router-params.png "Retrieving values from hot observables provided by Angular")

Again we start with the reactive approach first.

**Leveraging Reactive Programming** 
```typescript
import { Component} from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'example2-rx',
  template: `
  <h2>Example2 - Leverage Reactive Programming</h2>
  URL param: {{page | async}}
  `
})
export class Example2RxComponent  {
  page;

  constructor(private route: ActivatedRoute) {
    this.page = this.route.params
      .pipe(map((params: any) => params.page));
  }

}
```

Following things happen here:
- retrieving the new route params by using the `async` 
- deriving the values from the `page` param from `params` with a transformation operation using the `map` operator
- by using the `async` pipe we:
  - subscribe to the observable on `AfterContentChecked`
  - applying the internal value to the next pipe return value

On the next change detection run, we will see the latest emitted value in the view.

If the component gets destroyed,
the subscription that got set up in the `async` pipe before the first run of `AfterContentChecked` 
gets destroyed on the pipes `ngOnDestroy` [hook](https://github.com/angular/angular/blob/0119f46daf8f1efda00f723c5e329b0c8566fe07/packages/common/src/pipes/async_pipe.ts#L83).

**Avoiding Reactive Programming** 
```typescript
import { Component} from '@angular/core';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'example2-im',
  template: `
  <h2>Example2 - Avoid Reactive Programming</h2>
  URL param: {{page}}
  `
})
export class Example2ImComponent  {
  page;

  constructor(private route: ActivatedRoute) {
    this.route.params
      .subscribe(params => this.page = params.page)
  }

}
```

Following things happen here:
- retrieving the new route params by subscribing in the constructor 
- deriving the values from the `page` param from `params` object directly

On the next change detection run, we will see the latest emitted value in the view.

Even if observables from `ActivatedRoute` are hot we don't care about subscription handling because this is managed by angular.

### Retrieving values from hot observables provided by third parties

In this section, we take a look at a scenario not managed by the framework.
For this example, I will use the `@ngrx/store` library and it's `Store` service.

Retrieving state from the store and display its value in the view.

![](https://github.com/BioPhoton/ngRe/raw/master/ex3-store.png "Retrieving values from hot observables provided by third parties")

**Leveraging Reactive Programming** 
```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';


@Component({
  selector: 'example3-rx',
  template: `
  <h2>Example3 - Leverage Reactive Programming</h2>
  Store value {{page | async}}
  `
})
export class Example3RxComponent  {
  page;

  constructor(private store: Store<any>) {
    this.page = this.store.select(s => s.page);
  }

}
```

Following things happen here:
- retrieving the new state by using the `async` pipe
- deriving the values from the `page` param from `this.store` by using the `select` method
- by using the `async` pipe we:
  - subscribe to the observable on `AfterContentChecked`
  - applying the internal value to the next pipe return value

On the next change detection run, we will see the latest emitted value in the view.

If the component gets destroyed angular manages the subscription over the `async` pipe.

**Avoiding Reactive Programming** 
```typescript
import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'example3-im',
  template: `
  <h2>Example3 - Avoid Reactive Programming</h2>
  Store value {{page}}
  `
})
export class Example3ImComponent implements OnDestroy  {
  subscription;
  page;

  constructor(private store: Store<any>) {
    this.subscription = this.store.select(s => s.page)
    .subscribe(page => this.page = page);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
```

Following things happen here:
- retrieving the new state by subscribing in the constructor 
- deriving the values from the `page` param from `this.store` by using the `select` method
- we store the returned subscription from the `subscribe` call under `subscription`

On the next change detection run, we will see the latest emitted value in the view.

Here we have to manage the subscription in case the component gets destroyed.

- when the component gets destroyed
  - we call `this.subscription.unsubscribe()` in the `ngOnDestroy` life-cycle hook.

## Patterns to avoid observables

As these examples are very simple let me summarise the learning in with a broader view. 

### Where to subscribe

We saw that we subscribe to observables in different places.

Let's get a quick overview of the different options where we could subscribe.

1. constructor
2. ngOnChanges
3. ngOnInit
4. ngAfterContentInit
5. ngAfterContentChecked
6. subscription over `async` pipe in the template
7. ngAfterViewInit
8. ngAfterViewChecked
9. ngOnDestroy 

If we take another look at the above code examples we realize that we put our subscription in the constructor to avoid reactive programming.
And we put the subscription in the template when we leveraged reactive programming.

This is the critical thing, the **subscription**. 
The subscription is the place where values "dripping" out of the observable. 
It's the moment we start to mutate the properties of a component in an imperative way.

**In RxJS `.subscribe()` is where reactive programming ends.**

So the worst thing you could do to avoid reactive programming is to use the `async` pipe.
Let me give you a quick illustration of this learning:

![](https://github.com/BioPhoton/ngRe/raw/master/avoid-leverage-observables.png "Avoid Reactive Programming")

So now we know the following: 
- If we want to **avoid** reactive programming we have to 
**subscribe as early as possible**, i. e. in the `constructor`.
- If we want to **leverage** reactive programming we have to 
**subscribe as late as possible**, i. e. in the template.

As the last thing to mention here is a thing that I discover a lot when I consult projects is mixing the styles.
Until now I saw plenty of them and It was always a mess.

So as a suggestion from my side tries to avoid mixing stales as good as possible.

![](https://github.com/BioPhoton/ngRe/raw/master/mix-styles.png "Mixing Styles")


### Make it even easier

We realized that there is a bit of boilerplate to write to get the values out of the observable.
In some cases, we also need to manage the subscription according to the component's lifetime.

As this is annoying or even tricky, if we forget to unsubscribe, we could create some helper functions to do so. 

We could... But let's first look at some solutions out there.

In recent times 2 people presented something that I call "binding an observable to a property", for angular components.

[@MikeRyanDev](https://twitter.com/MikeRyanDev) presented the "connect" method in his presentation [Building with Ivy: rethinking reactive Angular](https://www.youtube.com/watch?v=rz-rcaGXhGk)  
and [@EliranEliassy](https://twitter.com/EliranEliassy) presented the "unsubscriber HOC" in his presentation [Everything you need to know about Ivy](https://www.youtube.com/watch?v=AKibI36WNhY)

Both of them eliminate the need to assign incoming values to a component property as well as manage the subscription.
The great thing about it is we can solve our problem with a one-liner and can switch to imperative programming without having any trouble.

As both versions are written for `Ivy` I can inform you that there are also several other libs out there for `ViewEngine`.

With this information, we could stop here and start avoiding reactive programming like a pro. ;)

But let's have the last section to give a bit reason for reactive programming.

## The reason for reactive programming

You may wonder why Angular introduced observables. 
Let me ask another question first, why do angular needs observables at all?

Yes, that's right, why observables at all?

I mean I have to admit I understand that the `Router` is observable based, but for example `HttpClient`, as single shot observable, or other things?
Not really, right... But there is!

Unified Subscription and Composition!

**Observables are a unified interface for pull and push-based collections**


Think about all the different APIs for asynchronous operations: 
- `setInterval` and `setInterval`
- `addEventListener` and `removeEventListener`
- `new Promise` and `your custom dispose logic` :)
- `requestAnimationFrame` and `cancelAnimationFrame`

When you start to use them together you will see that you and up soon in a big mess.
If you start to compose them and have them be dependent on each other hell breaks lose.

As this article is on avoiding reactive programming I keep the next example short and just show one **big benefit** of observables, **composition**. 

### Comparing composition

In this section, we will compose values from the `Store` with results from HTTP requests and render it in the template.
As we want to avoid broken UI state we have to handle race-conditions. 
Also if the component gets destroyed while a request is pending we don't process the result anymore. 

![](https://github.com/BioPhoton/ngRe/raw/master/ex4-store-and-http.png "Comparing composition")

**Leveraging Reactive Programming** 
```typescript
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

@Component({
  selector: 'example4-rx',
  template: `
  <h2>Example4 - Leverage Reactive Programming</h2>
  Repositories Page [{{page | async}}]: 
  <ul>
  <li *ngFor="let name of names | async">{{name}}</li>
  </ul>
  `
})
export class Example4RxComponent  {
  page;
  names;
  
  constructor(private store: Store<any>, private http: HttpClient) {
    this.page = this.store.select(s => s.page);
    this.names = this.page
      .pipe(
        switchMap(page => this.http.get(`https://api.github.com/orgs/ReactiveX/repos?page=${page}&per_page=5`)),
        map(res => res.map(i => i.name))
      );
  }

}
```

Following things roughly happen here:
- all values are retrieving by using the `async` pipe in the template
- deriving the values from the `page` param from `this.store` by using the `select` method
- deriving the HTTP result by combining the page observable with the HTTP observable
- solving race conditions by using the `switchMap` operator
- as all subscriptions are done by the `async` pipe we:
  - subscribe to all observables on `AfterContentChecked`
  - applying all arriving values to the pipes return value

On the next change detection run, we will see the latest emitted value in the template.

If the component gets destroyed angular manages the subscription over the `async` pipe.

**Avoiding Reactive Programming** 
```typescript
import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'example4-im',
  template: `
  <h2>Example4 - Avoid Reactive Programming</h2>
  Repositories Page [{{page}}]: 
  <ul>
  <li *ngFor="let name of names">{{name}}</li>
  </ul>
  `
})
export class Example4ImComponent implements OnDestroy  {
  pageSub = new Subscription();
  httpSub = new Subscription();
  page;
  names;

  constructor(private store: Store<any>, private http: HttpClient) {
    this.pageSub = this.store.select(s => s.page)
      .subscribe(page => {
        this.page = page;
        if(!this.httpSub.closed) {
          this.httpSub.unsubscribe();
        }

        this.httpSub = this.http
          .get(`https://api.github.com/orgs/ReactiveX/repos?page=${this.page}&per_page=5`)
                .subscribe((res: any) => {
                  this.names =  res.map(i => i.name);
                });
    });
  }

  ngOnDestroy() {
    this.pageSub.unsubscribe();
    this.httpSub.unsubscribe();
  }

}
```

Following things happen here:
- retrieving the new state by subscribing in the constructor 
- deriving the values from the `page` param from `this.store` by using the `select` method call subscribe
- we store the returned subscription from the `subscribe` call under `pageSub`
- in the store subscription we:
  - assign the arriving value to the components `page` property
  - we take the page value and subscribe to `http.get`
    - a HTTP `get` request fires
    - we retrieve the result in subscribe function
      - to handle race conditions we:
        - check if a subscription is active we check the `httpSub.closed` property
          - if it is active we close it
          - if it is done, and the HTTP request already arrived, we do nothing
        - we store the returned subscription from the `subscribe` call under `httpSub`

Here we have to manage the subscription in case the component gets destroyed.

- when the component gets destroyed
  - we call `this.pageSub.unsubscribe()` in the `ngOnDestroy` life-cycle hook
  - we call `this.httpSub.unsubscribe()` in the `ngOnDestroy` life-cycle hook


As we can see there is a difference in lines of code, indentations in the process description as well as differences in the complexity and maintainability of the code.

When I would think well the whole subscription handling is a clutter of Observables and reactive programming I could do one thing. 

Not using it. 

Not using it and implementing the scenario without another **big benefit** of observables, **a unified API**. 

If we compare 

the reactive approach with the following different APIs: 
- `subscribe` and `unsubscribe`

and the approach without observables with the following different APIs: 
- `addEventListener` and `removeEventListener`
- `new Promise` and `your custom dispose of logic`

and further, consider the **clean** implementation effort for those APIs in the race condition scenario
it shows us 2 things:
- how hard it is to compose asynchronous operations
- and the benefit of a unified API and functional composition

## Summary

What we learned about Reactive programming and observables is:
- Avoid it by subscribing as early as possible (use helpers for easy-going)
- Leverage it by subscribing as late as possible
- **Don't mix it!**
- Functional programming brings a lot of headaches and considers a leaning effort
- JavaScript's APIs for asynchronous operations is inconsistent (lots of lines of code)
- Imperative code gets complex with asynchronous operations (lots of how instructions)

Condensed there are 2 main learning:
- The **2 biggest benefits** of reactive programming are **a unified API** and **functional composition** 
- The **2 biggest constraints** of reactive programming are **a lot of headaches** and a **steep learning curve**
