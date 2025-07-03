export class SubmitAssignmentDto {
  courseId: number;
  text?: string;
}

export class GradeAssignmentDto {
  assignmentId: number;
  grade: number;
}
