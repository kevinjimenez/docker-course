import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(`HTTP`);
  use(req: Request, res: Response, next: NextFunction) {
    // console.log(Object.keys(res));
    // console.log(res);
    this.logger.log(
      `Logging HTTP request ${req.method} ${req.url} ${res.statusCode}`,
    );
    next();
  }
}
