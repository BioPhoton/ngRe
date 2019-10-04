import {AvoidReactivityContainerComponent} from './avoid-reactivity-container.component';
import {AvoidReactivitySubscriptionComponent} from './avoid-reactivity-subscription.component';

export const AVOIDING_REACTIVITY_ROUTES = [
  {
    path: '',
    component: AvoidReactivityContainerComponent,
    children: [
      {
        path: 'sync-with-class-property',
        component: AvoidReactivitySubscriptionComponent
      }
    ]
  }
];
