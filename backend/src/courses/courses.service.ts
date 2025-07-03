import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NOTIFICATIONS, RedisService } from '../lib';
import {
  CreateCourseDto,
  UpdateCourseDto,
  EnrollCourseDto,
} from './dto/course.dto';

@Injectable()
export class CoursesService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  public async createCourse(
    dto: CreateCourseDto,
    user: any,
    file?: Express.Multer.File,
  ) {
    const course = await this.prisma.course.create({
      data: {
        title: dto.title,
        credits: dto.credits,
        lecturerId: user.id,
        syllabus: file ? `uploads/${file.filename}` : null,
      },
    });

    await this.redisService.publish(
      NOTIFICATIONS,
      `New course created: ${dto.title}`,
    );
    return course;
  }

  public async updateCourse(
    id: number,
    dto: UpdateCourseDto,
    user: any,
    file?: Express.Multer.File,
  ) {
    const course = await this.prisma.course.findUnique({ where: { id } });

    if (!course || course.lecturerId !== user.id)
      throw new NotFoundException('Course not found or not authorized');

    const updated = await this.prisma.course.update({
      where: { id },
      data: {
        title: dto.title || course.title,
        credits: dto.credits || course.credits,
        syllabus: file ? `uploads/${file.filename}` : course.syllabus,
      },
    });

    await this.redisService.publish(
      NOTIFICATIONS,
      `Course updated: ${dto.title || course.title}`,
    );
    return updated;
  }

  public async getCourses() {
    return this.prisma.course.findMany();
  }

  public async getStudentDashboard(user: any) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { studentId: user.id, status: 'approved' },
      include: { course: true },
    });

    const courses = enrollments.map((e) => e.course);

    const assignments = {};

    for (const course of courses) {
      const grades = await this.getCourseGrades(course.id, user.id);
      assignments[course.id] = grades.grade;
    }

    return { courses, assignments };
  }

  public async getLecturerDashboard(user: any) {
    const courses = await this.prisma.course.findMany({
      where: { lecturerId: user.id },
    });

    const assignments = await this.prisma.assignment.findMany({
      where: { course: { lecturerId: user.id }, grade: null },
    });

    return { courses, assignments };
  }

  public async getAdminDashboard(user: any) {
    const courseCount = await this.prisma.course.count();
    const userCount = await this.prisma.user.count();

    const pendingEnrollments = await this.prisma.enrollment.count({
      where: { status: 'pending' },
    });

    return { overview: { courseCount, userCount, pendingEnrollments } };
  }

  public async enroll(dto: EnrollCourseDto, user: any) {
    const enrollment = await this.prisma.enrollment.create({
      data: { courseId: dto.courseId, studentId: user.id, status: 'pending' },
    });
    await this.redisService.publish(
      NOTIFICATIONS,
      `Enrollment pending for course ${dto.courseId}`,
    );
    return { message: 'Enrollment request sent' };
  }

  public async dropCourse(courseId: number, user: any) {
    const enrollment = await this.prisma.enrollment.findFirst({
      where: { courseId, studentId: user.id },
    });

    if (!enrollment) throw new NotFoundException('Enrollment not found');

    await this.prisma.enrollment.delete({
      where: { id: enrollment.id },
    });

    await this.redisService.publish(
      NOTIFICATIONS,
      `Dropped course ${courseId}`,
    );
    return { message: 'Course dropped successfully' };
  }

  public async getCourseGrades(courseId: number, studentId: number) {
    const assignments = await this.prisma.assignment.findMany({
      where: { courseId, studentId, grade: { not: null } },
    });
    if (assignments.length === 0) return { grade: null };
    const totalGrade = assignments.reduce((sum, a) => sum + (a.grade ?? 0), 0);
    const averageGrade = totalGrade / assignments.length;
    return { grade: averageGrade };
  }
}
