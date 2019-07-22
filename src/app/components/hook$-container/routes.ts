import {FullExampleContainerComponent} from './full-example-container.component';
import {HookContainerComponent} from './hook$-container.component';
import {SelectChangeContainerComponent} from './select-change-container.component';
import {ServiceLifeCycleContainerComponent} from './service-life-cycle-contaier.component';

export const HOOKS$_ROUTES = [
  {
    path: '',
    component: HookContainerComponent,
    children: [
      {
        path: 'full-example',
        component: FullExampleContainerComponent,
      },
      {
        path: 'service-hooks',
        component: ServiceLifeCycleContainerComponent,
      },
      {
        path: 'select-change',
        component: SelectChangeContainerComponent,
      },
    ]
  }
];
