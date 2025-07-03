import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CoursesController } from './courses.controller';
import { RedisService } from '../lib';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService, PrismaService, RedisService],
})
export class CoursesModule {}
