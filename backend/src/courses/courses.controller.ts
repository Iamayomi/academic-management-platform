import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import {
  CreateCourseDto,
  UpdateCourseDto,
  EnrollCourseDto,
} from './dto/course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GuardRoute, RoleAllowed } from 'src/lib';

@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @RoleAllowed('lecturer')
  @GuardRoute()
  @Post()
  @UseInterceptors(
    FileInterceptor('syllabus', {
      storage: diskStorage({ destination: './uploads' }),
    }),
  )
  async create(
    @Body() dto: CreateCourseDto,
    @Request() req,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.coursesService.createCourse(dto, req.user, file);
  }

  @RoleAllowed('lecturer')
  @GuardRoute()
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('syllabus', {
      storage: diskStorage({ destination: './uploads' }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.coursesService.updateCourse(Number(id), dto, req.user, file);
  }

  @GuardRoute()
  @Get()
  async getCourses() {
    return this.coursesService.getCourses();
  }

  @RoleAllowed('student')
  @GuardRoute()
  @Post('enroll')
  async enroll(@Body() dto: EnrollCourseDto, @Request() req) {
    return this.coursesService.enroll(dto, req.user);
  }

  @RoleAllowed('student')
  @GuardRoute()
  @Delete('enroll/:courseId')
  async drop(@Param('courseId') courseId: string, @Request() req) {
    return this.coursesService.dropCourse(Number(courseId), req.user);
  }

  @GuardRoute()
  @Get(':id/grades')
  async getGrades(@Param('id') id: string, @Request() req) {
    return this.coursesService.getCourseGrades(Number(id), req.user.id);
  }

  @RoleAllowed('student')
  @GuardRoute()
  @Get('/students/dashboard')
  async getStudentDashboard(@Request() req) {
    return this.coursesService.getStudentDashboard(req.user);
  }

  @RoleAllowed('lecturer')
  @GuardRoute()
  @Get('/lecturers/dashboard')
  async getLecturerDashboard(@Request() req) {
    return this.coursesService.getLecturerDashboard(req.user);
  }

  @RoleAllowed('admin')
  @GuardRoute()
  @Get('/admins/dashboard')
  async getAdminDashboard(@Request() req) {
    return this.coursesService.getAdminDashboard(req.user);
  }
}
