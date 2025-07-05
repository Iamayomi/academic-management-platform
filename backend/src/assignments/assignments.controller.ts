import {
  Controller,
  Post,
  Body,
  Put,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Delete,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GuardRoute, RoleAllowed } from '../lib';
import { AssignmentsService } from './assignments.service';
import {
  SubmitAssignmentDto,
  GradeAssignmentDto,
  CreateAssignmentDto,
} from './dto/assignment.dto';

@Controller('assignments')
export class AssignmentsController {
  constructor(private assignmentsService: AssignmentsService) {}

  @RoleAllowed('lecturer')
  @GuardRoute()
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({ destination: './uploads' }),
    }),
  )
  async createAssignment(
    @Request() req,
    @Body() createAssignmentDto: CreateAssignmentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.assignmentsService.createAssignment(
      createAssignmentDto,
      req.user.userId,
      file,
    );
  }

  @GuardRoute()
  @Get()
  async getAssignments(@Request() req) {
    return this.assignmentsService.getAssignments(
      req.user.userId,
      req.user.role,
    );
  }

  @RoleAllowed('student')
  @GuardRoute()
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({ destination: './uploads' }),
    }),
  )
  async submit(
    @Body() dto: SubmitAssignmentDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.assignmentsService.submitAssignment(dto, req.user, file);
  }

  @RoleAllowed('lecturer')
  @GuardRoute()
  @Put('grade')
  async grade(@Body() gradeAssignmentDto: GradeAssignmentDto, @Request() req) {
    return this.assignmentsService.gradeAssignment(
      req.user.userId,
      gradeAssignmentDto,
    );
  }

  @RoleAllowed('lecturer', 'admin')
  @GuardRoute()
  @Delete(':assignmentId')
  async deleteAssignment(
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
    @Request() req,
  ) {
    return await this.assignmentsService.deleteAssignment(
      assignmentId,
      req.user.role,
      req.user.userId,
    );
  }
}
