import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators} from "@angular/forms";
import moment from 'moment';
import {LoadingService} from '../loading/loading.service';
import {MessagesService} from '../messages/messages.service';
import {CoursesStore} from '../services/courses.store';

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css'],
  providers: [
    LoadingService,
    MessagesService
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class CourseDialogComponent {
  protected course = inject<Course>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder)
  protected form = this.fb.group({
    description: [this.course.description, Validators.required],
    category: [this.course.category, Validators.required],
    releasedAt: [moment(), Validators.required],
    longDescription: [this.course.longDescription, Validators.required]
  });
  private dialogRef = inject(MatDialogRef<CourseDialogComponent>);
  private coursesStore = inject(CoursesStore);
  private messagesService = inject(MessagesService);

  save() {
    const changes = this.form.value;
    this.coursesStore.saveCourse(this.course.id, changes)
      .subscribe();
    this.dialogRef.close(changes);
  }

  close() {
    this.dialogRef.close();
  }
}
