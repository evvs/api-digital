import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (token && (await this.redisService.checkBlacklist(token))) {
      throw new UnauthorizedException('Token is blacklisted');
    }

    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err, user, info: Error) {
    if (err || !user) {
      if (info instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token has expired!');
      }
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
