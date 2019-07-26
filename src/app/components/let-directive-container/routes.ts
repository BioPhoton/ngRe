import {LetDirectiveFullExampleComponent} from './full-example.component';
import {LetDirectiveHandlingConditionsComponent} from './handling-conditions.component';
import {LetDirectiveContainerComponent} from './let-directive-container.component';

export const LET_ROUTES = [
  {
    path: '',
    component: LetDirectiveContainerComponent,
    children: [
      {
        path: 'full-example',
        component: LetDirectiveFullExampleComponent
      },
      {
        path: 'handling-conditions',
        component: LetDirectiveHandlingConditionsComponent
      }
    ]
  }
];
