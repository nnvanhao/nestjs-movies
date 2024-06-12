import { Module } from '@nestjs/common';
import { TaskSchedulingController } from './task-scheduling.controller';
import { TaskSchedulingService } from './task-scheduling.service';

@Module({
  controllers: [TaskSchedulingController],
  providers: [TaskSchedulingService],
})
export class TaskSchedulingModule {}
