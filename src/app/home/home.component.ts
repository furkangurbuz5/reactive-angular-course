import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Course} from '../model/course';
import {Observable} from 'rxjs';
import {CoursesStore} from '../services/courses.store';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class HomeComponent {
  private readonly coursesStore = inject(CoursesStore);

  protected beginnerCourses$: Observable<Course[]> = this.coursesStore.filterByCategory("BEGINNER");
  protected advancedCourses$: Observable<Course[]> = this.coursesStore.filterByCategory("ADVANCED");
}
