import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TaskSchedulingService {
  private readonly logger = new Logger(TaskSchedulingService.name);

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // handleCron() {
  //   this.logger.debug('Called every 10 seconds');
  // }

  // @Interval(5000)
  // handleInterval() {
  //   this.logger.debug('Called every 5 seconds');
  // }

  // @Timeout(3000)
  // handleTimeout() {
  //   this.logger.debug('Called once after 3 seconds');
  // }
}
