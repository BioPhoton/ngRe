import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {Let$Directive, NgxReModule, Push$Pipe} from '@ngx-re';

import {AppComponent} from './app.component';
import {APP_ROUTES} from './app.routes';
import {FROM_VIEW_EVENT$_DECLARATIONS} from './components/from-view-event-container';
import {HOOK_DECLARATIONS} from './components/hook$-container';
import {HOST_LISTENER$_DECLARATIONS} from './components/host-listener-container';
import {INPUT$_DECLARATIONS} from './components/input-container';
import {LET_DECLARATIONS} from './components/let-directive-container';
import {LOCAL_STATE_DECLARATIONS} from './components/local-state-container';
import {PUSH$_DECLARATIONS} from './components/push-pipe-container';

@NgModule({
  declarations: [
    Push$Pipe,
    Let$Directive,
    // ===================
    AppComponent,
    PUSH$_DECLARATIONS,
    HOOK_DECLARATIONS,
    HOST_LISTENER$_DECLARATIONS,
    INPUT$_DECLARATIONS,
    FROM_VIEW_EVENT$_DECLARATIONS,
    LOCAL_STATE_DECLARATIONS,
    LET_DECLARATIONS
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxReModule,
    RouterModule.forRoot(APP_ROUTES)
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule {
}
