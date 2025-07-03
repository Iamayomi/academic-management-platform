import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NOTIFICATIONS, RedisService } from '../lib';
import { SubmitAssignmentDto, GradeAssignmentDto } from './dto/assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  async submitAssignment(
    dto: SubmitAssignmentDto,
    user: any,
    file?: Express.Multer.File,
  ) {
    // if (user.role !== 'student')
    //   throw new ForbiddenException('Only students can submit assignments');
    const filePath = file
      ? `uploads/${file.filename}`
      : dto.text
        ? `uploads/text_${Date.now()}.txt`
        : null;
    if (dto.text && !file) {
      require('fs').writeFileSync(filePath, dto.text);
    }
    const assignment = await this.prisma.assignment.create({
      data: {
        courseId: dto.courseId,
        studentId: user.id,
        file: filePath,
      },
    });
    await this.redisService.publish(
      NOTIFICATIONS,
      `New assignment submitted for course ${dto.courseId}`,
    );
    return assignment;
  }

  async gradeAssignment(
    assignmentId: number,
    dto: GradeAssignmentDto,
    user: any,
  ) {
    // if (user.role !== 'lecturer')
    //   throw new ForbiddenException('Only lecturers can grade assignments');
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) throw new NotFoundException('Assignment not found');
    const updated = await this.prisma.assignment.update({
      where: { id: assignmentId },
      data: { grade: dto.grade },
    });

    await this.redisService.publish(
      NOTIFICATIONS,
      `Assignment ${assignmentId} graded: ${dto.grade}`,
    );
    return { message: 'Assignment graded' };
  }
}
