export class CreateCourseDto {
  title: string;
  credits: number;
}

export class UpdateCourseDto {
  title?: string;
  credits?: number;
}

export class EnrollCourseDto {
  courseId: number;
}
