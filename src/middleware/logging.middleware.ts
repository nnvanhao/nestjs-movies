import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private logger = new Logger('Request');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, headers, ip } = req;
    const userAgent = headers['user-agent'];

    const start = Date.now();

    res.on('finish', () => {
      const statusCode = res.statusCode;
      const responseTime = Date.now() - start;

      const mess = `[${method}] ${originalUrl} - IP: ${ip}, User-Agent: ${userAgent}, Status: ${statusCode}, Response Time: ${responseTime}ms`;
      if (statusCode >= 400) {
        // Log error for non-2xx status codes
        this.logger.error(mess);
      } else {
        // Log normal request for 2xx status codes
        this.logger.log(mess);
      }
    });

    next();
  }
}
