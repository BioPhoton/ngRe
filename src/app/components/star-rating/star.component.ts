import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-star',
  template: `
    <div class="star">
      <i class="star-empty"></i>
      <i class="star-half"></i>
      <i class="star-filled"></i>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarComponent {

}
