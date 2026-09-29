import {inject, OnDestroy, Service} from '@angular/core';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import {Course, CourseResponse, sortCoursesBySeqNo} from '../model/course';
import {catchError, map, shareReplay, takeUntil, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {LoadingService} from '../loading/loading.service';
import {MessagesService} from '../messages/messages.service';

@Service()
export class CoursesStore implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly loading = inject(LoadingService);
  private readonly messages = inject(MessagesService);

  private readonly coursesSubject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.coursesSubject.asObservable();
  private readonly destroy$ = new Subject<void>();

  constructor() {
    this.loadAllCourses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public saveCourse(courseId: string, changes: Partial<Course>): Observable<Course> {
    const newCourses: Course[] = this.coursesSubject.getValue()
      .map((course: Course): Course => {
        return (course.id === courseId) ? {...course, ...changes} : course;
      });

    this.coursesSubject.next(newCourses);

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

  public filterByCategory(category: string): Observable<Course[]> {
    return this.courses$
      .pipe(
        map(courses =>
          courses.filter(course => course.category === category)
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
        tap(courses => this.coursesSubject.next(courses))
      );

    this.loading.showLoaderUntilCompleted(loadCourses$)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
