import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { AiModule } from './ai/ai.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PrismaService } from '../prisma/prisma.service';
import { AppConfigModule } from './lib/config/config.module';
import { RedisModule, ResponseInterceptor } from './lib';

@Module({
  imports: [
    AppConfigModule,
    RedisModule,
    AuthModule,
    CoursesModule,
    AssignmentsModule,
    AiModule,
    NotificationsModule,
  ],

  providers: [
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
