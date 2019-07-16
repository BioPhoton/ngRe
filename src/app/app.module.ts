import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {PushPipe} from './addons/push$-pipe/push.pipe';

import {AppComponent} from './app.component';
import {HostListenerContainerComponent} from './components/host-listener-container/host-listener-container.component';
import {HostListenerComponent} from './components/host-listener-container/host-listener.component';
import {InputContainerComponent} from './components/input-container/input-container.component';
import {InputComponent} from './components/input-container/input.component';
import {OptionsComponent} from './components/local-state-container/full-example-container/components/options.component';
import {PipeTestsPanelComponent} from './components/local-state-container/full-example-container/components/pipe-tests-panel.component';
import {TableComponent} from './components/local-state-container/full-example-container/components/table.component';
import {FullExampleContainerComponent} from './components/local-state-container/full-example-container/full-example-container.component';
import {LateSubscribersContainerComponent} from './components/local-state-container/late-subscribers/late-subscribers-container.component';
import {OutputContainerComponent} from './components/output-container/output-container.component';
import {OutputComponent} from './components/output-container/output.component';
import {PushPipeContainerComponent} from './components/push-pipe-container/push-pipe-container.component';
import {PushPipeComponent} from './components/push-pipe-container/push-pipe.component';
import { LocalStateContainerComponent } from './components/local-state-container/full-example-container/local-state-container.component';
import { LocalStateComponent } from './components/local-state-container/full-example-container/local-state.component';
// import {LifeCycleHooksContainerComponent} from './components/life-cycle-hooks-container/life-cycle-hooks-container.component';
// import {LifeCycleHooksComponent} from './components/life-cycle-hooks-container/life-cycle-hooks.component';
// import {SelectChangeComponent} from './components/life-cycle-hooks-container/select-change.component';

@NgModule({
  declarations: [
    AppComponent,
    PushPipeContainerComponent,
    PushPipeComponent,
    PushPipe,
    // LifeCycleHooksContainerComponent,
    // LifeCycleHooksComponent,
    // SelectChangeComponent,
    OutputContainerComponent,
    OutputComponent,
    InputContainerComponent,
    InputComponent,
    HostListenerContainerComponent,
    HostListenerComponent,
    LocalStateContainerComponent,
    LocalStateComponent,
    OptionsComponent,
    PipeTestsPanelComponent,
    LateSubscribersContainerComponent,
    FullExampleContainerComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: 'push-pipe',
        component: PushPipeContainerComponent
      },
      /*  {
         path: 'live-cycle-hooks',
         component: LifeCycleHooksContainerComponent
       },
      {
         path: 'select-change',
         component: SelectChangeComponent
       },*/
      {
        path: 'host-listener',
        component: HostListenerContainerComponent
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
        component: FullExampleContainerComponent
      },
      {
        path: 'late-subscribers',
        component: LateSubscribersContainerComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [PushPipe]
})
export class AppModule {
}
