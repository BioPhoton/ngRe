import {FullExampleContainerComponent} from './full-example-container/full-example-container.component';
import {LateSubscribersContainerComponent} from './late-subscribers/late-subscribers-container.component';
import {LocalStateContainerComponent} from './local-state-container.component';

export const LOCAL_STATE_ROUTES = [
  {
    path: '',
    component: LocalStateContainerComponent,
    children: [
      {
        path: 'full-example',
        component: FullExampleContainerComponent
      },
      {
        path: 'state-clean-up',
        component: LateSubscribersContainerComponent
      }

    ]
  }
];
