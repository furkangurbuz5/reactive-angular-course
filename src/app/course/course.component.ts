import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CourseData} from '../model/course';
import {map, tap} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {CoursesService} from '../services/courses.service';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class CourseComponent implements OnInit {
  data$: Observable<CourseData>;
  private readonly route = inject(ActivatedRoute)
  private readonly coursesService = inject(CoursesService);

  ngOnInit() {
    this.getCourseData();
  }

  private getCourseData(): void {
    const courseId = parseInt(this.route.snapshot.paramMap.get("courseId"));
    const course$ = this.coursesService.loadCourseById(courseId);
    const lessons$ = this.coursesService.loadAllCourseLessons(courseId);
    this.data$ = combineLatest([course$, lessons$])
      .pipe(
        map(([course, lessons]) => {
          return {
            course,
            lessons
          }
        }),
        tap(console.log)
      );
  }
}











