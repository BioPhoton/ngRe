import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {PushPipeContainerComponent} from './push-pipe-container/push-pipe-container.component';
import {PushPipeDisplayComponent} from './push-pipe-container/push-pipe-display/push-pipe-display.component';
import {PushPipe} from './push.pipe';
import {ReactiveLifeCycleHooksContainerComponent} from './reactive-life-cycle-hooks-container/reactive-life-cycle-hooks-container.component';
import {ReactiveLifeCycleHooksComponent} from './reactive-life-cycle-hooks-container/reactive-life-cycle-hooks/reactive-life-cycle-hooks.component';

@NgModule({
  declarations: [
    AppComponent,
    PushPipeContainerComponent,
    PushPipeDisplayComponent,
    PushPipe,
    ReactiveLifeCycleHooksContainerComponent,
    ReactiveLifeCycleHooksComponent
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
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [PushPipe]
})
export class AppModule {
}
