import { Module } from '@nestjs/common';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../lib';

@Module({
  controllers: [AssignmentsController],
  providers: [AssignmentsService, PrismaService, RedisService],
})
export class AssignmentsModule {}
