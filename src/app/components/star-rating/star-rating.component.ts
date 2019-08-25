import {ChangeDetectionStrategy, Component} from '@angular/core';


@Component({
  selector: 'app-star-rating',
  template: `
    <div id="{{id}}"
      class="rating"
      (mouseleave)="leaveStarContainer()">
      <div *ngIf="labelText" class="label-value">{{labelText}}</div>
      <div class="star-container">
        <app-star
          (mouseenter)="enterStar(star)"
          *ngFor="let star of stars"
          (click)="selectStar(star)">
        </app-star>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarRatingComponent {
  id;
  labelText;
  stars = [0, 1, 2, 3, 4];

  enterStar(starNumber: number) {

  }

  leaveStarContainer() {

  }

  selectStar(starNumber: number) {

  }

}
