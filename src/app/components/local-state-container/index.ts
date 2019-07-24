import {CreationAndCleanUpContainerComponent} from './creation-and-clean-up/creation-and-clean-up-container.component';
import {EarlyProducerContainerComponent} from './early-producer/early-producer-container.component';
import {ChildLocalStateContainerComponent} from './full-example-container/child-local-state-container.component';
import {OptionsComponent} from './full-example-container/components/options.component';
import {TableComponent} from './full-example-container/components/table.component';
import {FullExampleContainerComponent} from './full-example-container/full-example-container.component';
import {LocalStateContainer2Component} from './full-example-container/local-state-container2.component';
import {LateSubscriberComponent} from './late-subscribers/late-subscriber.component';
import {LateSubscribersContainerComponent} from './late-subscribers/late-subscribers-container.component';
import {LocalStateContainerComponent} from './local-state-container.component';
import {NgForContainerComponent} from './ng-for/ng-for-container.component';

export * from './routes';
export const LOCAL_STATE_DECLARATIONS = [
  CreationAndCleanUpContainerComponent,

  LateSubscribersContainerComponent,
  LateSubscriberComponent,

  EarlyProducerContainerComponent,

  NgForContainerComponent,

  ChildLocalStateContainerComponent,
  LocalStateContainer2Component,
  OptionsComponent,
  LocalStateContainerComponent,
  FullExampleContainerComponent,
  TableComponent

];
