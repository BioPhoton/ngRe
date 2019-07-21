import {LetDirectiveContainerComponent} from '../let-directive-container/let-directive-container.component';
import {OptionsComponent} from './full-example-container/components/options.component';
import {PipeTestsPanelComponent} from './full-example-container/components/pipe-tests-panel.component';
import {TableComponent} from './full-example-container/components/table.component';
import {FullExampleContainerComponent} from './full-example-container/full-example-container.component';
import {ChildLocalStateContainerComponent} from './full-example-container/child-local-state-container.component';
import {LocalStateContainer2Component} from './full-example-container/local-state-container2.component';
import {LateSubscribersContainerComponent} from './late-subscribers/late-subscribers-container.component';
import {LocalStateContainerComponent} from './local-state-container.component';

export * from './routes';
export const LOCAL_STATE_DECLARATIONS = [
  ChildLocalStateContainerComponent,
  LocalStateContainer2Component,
  OptionsComponent,
  PipeTestsPanelComponent,
  LateSubscribersContainerComponent,
  LocalStateContainerComponent,
  FullExampleContainerComponent,
  TableComponent,

];
