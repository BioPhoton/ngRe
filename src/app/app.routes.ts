import {FROM_VIEW_EVENT$_ROUTES} from './components/from-view-event-container';
import {HOOKS$_ROUTES} from './components/hook$-container';
import {HOST_LISTENER$_ROUTES} from './components/host-listener-container';
import {INPUT$_ROUTES} from './components/input-container';
import {LET_ROUTES} from './components/let-directive-container';
import {LOCAL_STATE_ROUTES} from './components/local-state-container';
import {PUSH$_ROUTES} from './components/push-pipe-container';

export const APP_ROUTES = [
 // {path: '', redirectTo: 'readme', pathMath: 'full'},
  {path: 'push-pipe', children: PUSH$_ROUTES},
  {path: 'hook', children: HOOKS$_ROUTES},
  {path: 'host-listener', children: HOST_LISTENER$_ROUTES},
  {path: 'input', children: INPUT$_ROUTES},
  {path: 'from-view-event', children: FROM_VIEW_EVENT$_ROUTES},
  {path: 'local-state', children: LOCAL_STATE_ROUTES},
  {path: 'let-directive', children: LET_ROUTES}
];
