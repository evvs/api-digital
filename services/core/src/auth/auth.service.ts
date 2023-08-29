import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenDto } from './dto/auth-token.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: AuthTokenDto) {
    // Check hardcoded credentials
    if (user.user !== 'zenit' || user.password !== '2bgjSQ3u6IRwyfs') {
      // example before db implementation
      throw new UnauthorizedException('Invalid username or password');
    }

    // If credentials match, generate JWT tokens
    const payload = { username: user.user };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '86400s', // 1 day
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      }),
      token_type: 'bearer',
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
        token_type: 'bearer',
        expires_in: 86400,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
