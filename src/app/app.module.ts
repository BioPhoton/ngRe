import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ContainerComponent } from './container/container.component';
import { DisplayComponent } from './container/display/display.component';
import { PushPipe } from './push.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ContainerComponent,
    DisplayComponent,
    PushPipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [PushPipe]
})
export class AppModule { }
