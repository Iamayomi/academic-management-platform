import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAssignmentDto {
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @IsString()
  @IsOptional()
  text?: string;
}

export class SubmitAssignmentDto {
  @IsNumber()
  @IsNotEmpty()
  assignmentId: number;

  @IsString()
  @IsOptional()
  text?: string;
}

// extends PartialType(CreateAssignmentDto) {
//   @IsNumber()
//   @IsNotEmpty()
//   studentId: string;
// }

export class GradeAssignmentDto {
  @IsNumber()
  @IsNotEmpty()
  assignmentId: number;

  @IsNotEmpty()
  @IsNotEmpty()
  grade: number;
}
