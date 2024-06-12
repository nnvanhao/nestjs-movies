import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  PrismaHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import * as os from 'os';
import { PrismaService } from 'src/prisma/prisma.service';

@ApiTags('Health Check')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: PrismaHealthIndicator,
    private prismaService: PrismaService,
    private readonly disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.http.pingCheck('nest-app', `${process.env.SERVER_URL}/v1/`),
      () => this.db.pingCheck('database', this.prismaService),
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 50,
        }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);
  }
}
