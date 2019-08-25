import {PushPipeChannelsComponent} from './push-pipe-channels.component';
import {PushPipeContainerComponent} from './push-pipe-container.component';

export const PUSH$_ROUTES = [
  {
    path: '',
    component: PushPipeContainerComponent,
    children: [
      {
        path: 'pipe-channels',
        component: PushPipeChannelsComponent
      }
    ]
  }
];
