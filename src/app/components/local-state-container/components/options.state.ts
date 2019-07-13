import {DisplayComponentState} from './display-compoent-state.interface';

export interface OptionsState extends DisplayComponentState<{ [key: string]: boolean }, string[]> {
  state: { [key: string]: boolean };
  config: string[];
}
