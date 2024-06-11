import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class HttpsAndCorsMiddleware implements NestMiddleware {
  private readonly allowedDomains = [process.env.CLIENT_WEB_URL];
  use(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin;

    // Allow requests without origin header (e.g., from Postman)
    if (!origin) {
      return next();
    }

    if (!origin || !this.isAllowedDomain(origin)) {
      throw new HttpException(
        'Access to this service is not allowed from this domain.',
        HttpStatus.FORBIDDEN,
      );
    }

    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );

    if (req.method === 'OPTIONS') {
      res.status(HttpStatus.OK).end();
      return;
    }

    next();
  }

  private isAllowedDomain(origin: string): boolean {
    return this.allowedDomains.includes(origin.toLowerCase());
  }

  private isSwaggerRequest(req: Request): boolean {
    const userAgent = req.headers['user-agent'];
    return (
      userAgent &&
      (userAgent.includes('Swagger') || userAgent.includes('swagger-ui'))
    );
  }
}
