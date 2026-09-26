import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {LoadingService} from './loading.service';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class LoadingComponent {
  protected readonly loadingService = inject(LoadingService);
}
