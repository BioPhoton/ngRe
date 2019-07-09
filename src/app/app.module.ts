import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {PushPipe} from './addons/pipes/push.pipe';

import {AppComponent} from './app.component';
import {InputContainerComponent} from './components/input-container/input-container.component';
import {InputComponent} from './components/input-container/input/input.component';
import {OutputBindingContainerComponent} from './components/output-binding-container/output-binding-container.component';
import {OutputBindingComponent} from './components/output-binding-container/output-binding/output-binding.component';
import {PushPipeContainerComponent} from './components/push-pipe-container/push-pipe-container.component';
import {PushPipeComponent} from './components/push-pipe-container/push-pipe-display/push-pipe.component';
import {ReactiveLifeCycleHooksContainerComponent} from './components/reactive-life-cycle-hooks-container/reactive-life-cycle-hooks-container.component';
import {ReactiveLifeCycleHooksComponent} from './components/reactive-life-cycle-hooks-container/reactive-life-cycle-hooks/reactive-life-cycle-hooks.component';

@NgModule({
  declarations: [
    AppComponent,
    PushPipeContainerComponent,
    PushPipeComponent,
    PushPipe,
    ReactiveLifeCycleHooksContainerComponent,
    ReactiveLifeCycleHooksComponent,
    OutputBindingContainerComponent,
    OutputBindingComponent,
    InputContainerComponent,
    InputComponent
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
        component: ReactiveLifeCycleHooksContainerComponent
      },
      {
        path: 'input',
        component: InputContainerComponent
      },
      {
        path: 'from-view',
        component: OutputBindingContainerComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [PushPipe]
})
export class AppModule {
}
