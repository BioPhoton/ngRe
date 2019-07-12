import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {PushPipe} from './addons/pipes/push.pipe';

import {AppComponent} from './app.component';
import {InputContainerComponent} from './components/input-container/input-container.component';
import {InputComponent} from './components/input-container/input/input.component';
import {OptionsComponent} from './components/local-state-container/components/options.component';
import {OutputContainerComponent} from './components/output-container/output-container.component';
import {OutputComponent} from './components/output-container/output/output.component';
import {PushPipeContainerComponent} from './components/push-pipe-container/push-pipe-container.component';
import {PushPipeComponent} from './components/push-pipe-container/push-pipe-display/push-pipe.component';
import { LocalStateContainerComponent } from './components/local-state-container/local-state-container.component';
import { LocalStateComponent } from './components/local-state-container/local-state.component';
import {LifeCycleHooksContainerComponent} from './components/life-cycle-hooks-container/life-cycle-hooks-container.component';
import {LifeCycleHooksComponent} from './components/life-cycle-hooks-container/life-cycle-hooks/life-cycle-hooks.component';

@NgModule({
  declarations: [
    AppComponent,
    PushPipeContainerComponent,
    PushPipeComponent,
    PushPipe,
    LifeCycleHooksContainerComponent,
    LifeCycleHooksComponent,
    OutputContainerComponent,
    OutputComponent,
    InputContainerComponent,
    InputComponent,
    LocalStateContainerComponent,
    LocalStateComponent,
    OptionsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: 'push-pipe',
        component: PushPipeContainerComponent
      },
     {
        path: 'live-cycle-hooks',
        component: LifeCycleHooksContainerComponent
      },
      {
        path: 'input',
        component: InputContainerComponent
      },
      {
        path: 'output',
        component: OutputContainerComponent
      },
      {
        path: 'local-state',
        component: LocalStateContainerComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [PushPipe]
})
export class AppModule {
}
