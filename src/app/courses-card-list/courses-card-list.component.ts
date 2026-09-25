import {ChangeDetectionStrategy, Component, inject, input, output} from '@angular/core';
import {Course} from '../model/course';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CourseDialogComponent} from '../course-dialog/course-dialog.component';
import {filter, tap} from 'rxjs/operators';

@Component({
  selector: 'courses-card-list',
  templateUrl: './courses-card-list.component.html',
  styleUrls: ['./courses-card-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class CoursesCardListComponent {
  public readonly courses = input.required<Course[]>();
  public readonly coursesChanged = output<void>();
  private readonly dialog = inject(MatDialog);

  editCourse(course: Course): void {
    const dialogConfig = this.createCourseDialog(course);

    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap(() => this.coursesChanged.emit())
      )
      .subscribe();
  }

  private createCourseDialog(data: Course): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = 'dialog';
    dialogConfig.width = "400px";
    dialogConfig.data = data;

    return dialogConfig;
  }
}
