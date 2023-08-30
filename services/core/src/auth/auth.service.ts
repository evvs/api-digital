import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenDto } from './dto/auth-token.dto';
import { RedisService } from 'src/redis/redis.service';
import { BlacklistDto } from './dto/blacklist.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
    private usersService: UsersService,
  ) {}

  private async validateUser(user: string, password: string): Promise<void> {
    const isValid = await this.usersService.validateUser(user, password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid username or password');
    }
  }

  async login(user: AuthTokenDto) {
    await this.validateUser(user.user, user.password);

    const payload = { username: user.user };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '86400s', // 1 day
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      }),
      token_type: 'Bearer',
      expires_in: 86400,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decodedToken = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });

      const payload = { username: decodedToken.username };

      return {
        access_token: this.jwtService.sign(payload, {
          secret: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: '86400s',
        }),
        token_type: 'Bearer',
        expires_in: 86400,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async addToBlackList(blacklistDto: BlacklistDto) {
    await this.validateUser(blacklistDto.user, blacklistDto.password);
    await this.redisService.addToBlacklist(blacklistDto.token);
    return { status: 'success', message: 'Token blacklisted successfully' };
  }
}
