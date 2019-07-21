import {FullExampleContainerComponent} from './full-example-container.component';
import {HookContainerComponent} from './hook$-container.component';
import {SelectChangeContainerComponent} from './select-change-container.component';

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
        path: 'select-change',
        component: SelectChangeContainerComponent,
      },
    ]
  }
];
