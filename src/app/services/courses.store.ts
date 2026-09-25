import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {Course, CourseResponse, sortCoursesBySeqNo} from '../model/course';
import {catchError, map, shareReplay, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {LoadingService} from '../loading/loading.service';
import {MessagesService} from '../messages/messages.service';


@Injectable({
  providedIn: 'root'
})
export class CoursesStore {
  private readonly http = inject(HttpClient);
  private readonly loading = inject(LoadingService);
  private readonly messages = inject(MessagesService);

  private readonly subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor() {
    this.loadAllCourses();
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<Course> {
    const newCourses: Course[] = this.subject.getValue()
      .map((course: Course): Course => {
        return (course.id === courseId) ? { ...course, ...changes } : course;
      });

    this.subject.next(newCourses);

    return this.http.put<Course>(`/api/courses/${courseId}`, changes)
      .pipe(
        catchError(err => {
          const message = "Could not save course";
          console.log(message, err);
          this.messages.showErrors(message);
          return throwError(err);
        }),
        shareReplay()
      );
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$
      .pipe(
        map(courses =>
          courses.filter(course => course.category == category)
            .sort(sortCoursesBySeqNo)
        )
      )
  }

  private loadAllCourses() {
    const loadCourses$ = this.http.get<CourseResponse>('/api/courses')
      .pipe(
        map(response => response.payload),
        catchError(err => {
          const message = "Could not load courses";
          this.messages.showErrors(message);
          console.log(message, err);
          return throwError(err);
        }),
        tap(courses => this.subject.next(courses))
      );

    this.loading.showLoaderUntilCompleted(loadCourses$)
      .subscribe();
  }

}
