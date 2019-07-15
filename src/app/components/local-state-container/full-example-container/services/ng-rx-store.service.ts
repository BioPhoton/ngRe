import {Injectable} from '@angular/core';
import {LocalStateService} from '../../../../addons/local-state$-service/local-state';
import {getRandomAttendees, getRandomCity} from '../random';

// Requires a model

@Injectable({
  providedIn: 'root'
})
export class NgRxStoreService {

  private store = new LocalStateService();
  storeState$ = this.store.state$;

  constructor() {
    this.updateAttendees();
    this.updateCities();
  }

  updateAttendees() {
    this.store.setSlice({attendees: getRandomAttendees(10)});
  }

  updateCities() {
    this.store.setSlice({cities: getRandomCity(3)});
  }
}
