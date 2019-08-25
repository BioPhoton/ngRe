import {ChangeDetectionStrategy, Component} from '@angular/core';


@Component({
  selector: 'app-star-rating-container',
  template: `
    <h1>StarRating Container</h1>
    <app-star-rating></app-star-rating>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarRatingContainerComponent {

}
