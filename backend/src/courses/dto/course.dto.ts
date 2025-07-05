import {
  IsNotEmpty,
  IsNumber,
  isNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  credits: number;

  @IsString()
  @IsOptional()
  syllabus?: string;
}

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  credits?: number;
}

export class EnrollCourseDto {
  @IsString()
  @IsNotEmpty()
  courseId: number;
}
