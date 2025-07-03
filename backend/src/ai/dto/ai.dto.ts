import { IsNotEmpty, IsString } from 'class-validator';

export class RecommendDto {
  @IsString()
  @IsNotEmpty()
  interest: string;
}

export class SyllabusDto {
  @IsString()
  @IsNotEmpty()
  topic: string;
}
