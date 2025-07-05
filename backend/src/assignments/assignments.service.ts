import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NOTIFICATIONS, RedisService } from '../lib';
import {
  SubmitAssignmentDto,
  GradeAssignmentDto,
  CreateAssignmentDto,
} from './dto/assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  async createAssignment(
    createAssignmentDto: CreateAssignmentDto,
    userId: number,
    file?: Express.Multer.File,
  ) {
    const { courseId, text } = createAssignmentDto;

    const filePath = file
      ? `uploads/${file.filename}`
      : text
        ? `uploads/text_${Date.now()}.txt`
        : null;

    if (text && !file) {
      require('fs').writeFileSync(filePath, text);
    }

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.lecturerId !== userId) {
      throw new ForbiddenException(
        'Only the course lecturer can create assignments',
      );
    }

    const assignment = await this.prisma.assignment.create({
      data: {
        courseId: courseId,
        studentId: userId,
        file: filePath,
      },
    });

    await this.redisService.publish(
      NOTIFICATIONS,
      `New assignment created for course ${courseId}`,
    );
    return assignment;
  }

  public async getAssignments(userId: number, role: string) {
    if (role === 'admin') {
      return this.prisma.assignment.findMany({
        include: { course: true, student: true },
      });
    } else if (role === 'lecturer') {
      return this.prisma.assignment.findMany({
        where: { course: { lecturerId: userId } },
        include: { course: true, student: true },
      });
    } else {
      return this.prisma.assignment.findMany({
        where: { studentId: userId },
        include: { course: true },
      });
    }
  }

  public async submitAssignment(
    submitAssignmentDto: SubmitAssignmentDto,
    userId: number,
    file?: Express.Multer.File,
  ) {
    const { assignmentId, text } = submitAssignmentDto;
    const filePath = file
      ? `uploads/${file.filename}`
      : text
        ? `uploads/text_${Date.now()}.txt`
        : null;

    if (text && !file) {
      require('fs').writeFileSync(filePath, text);
    }

    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { course: true },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    const enrollment = await this.prisma.enrollment.findFirst({
      where: { courseId: assignment.courseId, studentId: userId },
    });
    if (!enrollment) {
      throw new ForbiddenException('Student not enrolled in course');
    }

    const updatedAssignment = await this.prisma.assignment.update({
      where: { id: assignmentId },
      data: { studentId: userId, file: filePath },
    });

    await this.redisService.publish(
      NOTIFICATIONS,
      `Assignment ${assignmentId} submitted by student ${userId}`,
    );
    return updatedAssignment;
  }

  public async gradeAssignment(
    userId: number,
    gradeAssignmentDto: GradeAssignmentDto,
  ) {
    const { grade, assignmentId } = gradeAssignmentDto;

    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) throw new NotFoundException('Assignment not found');

    const enrollment = await this.prisma.enrollment.findFirst({
      where: { courseId: assignment.courseId, studentId: userId },
    });
    if (!enrollment) {
      throw new ForbiddenException('Student not enrolled in course');
    }

    const updatedAssignment = await this.prisma.assignment.update({
      where: { id: assignmentId },
      data: { grade },
    });

    await this.redisService.publish(
      NOTIFICATIONS,
      `Assignment ${assignmentId} graded: ${grade}`,
    );
    return { message: 'Assignment graded' };
  }

  public async deleteAssignment(
    assignmentId: number,
    role: string,
    userId: number,
  ) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { course: true },
    });
    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.course.lecturerId !== userId && role !== 'admin') {
      throw new ForbiddenException(
        'Only the course lecturer or admin can delete assignments',
      );
    }

    await this.prisma.assignment.delete({
      where: { id: assignmentId },
    });

    await this.redisService.publish(
      NOTIFICATIONS,
      `Assignment ${assignmentId} deleted`,
    );
    return { message: 'Assignment deleted successfully' };
  }
}
