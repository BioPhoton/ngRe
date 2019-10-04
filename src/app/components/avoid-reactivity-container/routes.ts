import {PushPipeContainerComponent} from '../push-pipe-container/push-pipe-container.component';
import {AvoidReactivitySubscriptionComponent} from './avoid-reactivity-subscription.component';

export const AVOIDING_REACTIVITY_ROUTES = [
  {
    path: '',
    component: PushPipeContainerComponent,
    children: [
      {
        path: 'sync-with-class-property',
        component: AvoidReactivitySubscriptionComponent
      }
    ]
  }
];
