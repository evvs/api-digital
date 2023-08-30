import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthTokenDto } from './dto/auth-token.dto';
import {
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthTokenOkResponseDto } from './dto/auth-token-ok-response.dto';
import { RefreshTokenOkResponseDto } from './dto/refresh-token-ok-response.dto';
import { RedisService } from 'src/redis/redis.service';
import { BlacklistDto } from './dto/blacklist.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private redisService: RedisService,
  ) {}

  @ApiExtraModels(AuthTokenOkResponseDto)
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(AuthTokenOkResponseDto),
    },
  })
  @Post('token')
  @ApiTags('Auth')
  @HttpCode(200)
  async login(@Body() authTokenUserDto: AuthTokenDto) {
    return this.authService.login(authTokenUserDto);
  }

  @ApiExtraModels(RefreshTokenOkResponseDto)
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(RefreshTokenOkResponseDto),
    },
  })
  @Post('refresh')
  @ApiTags('Auth')
  @HttpCode(200)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto.refresh_token);
  }

  @Post('blacklist')
  @ApiTags('Auth')
  @HttpCode(200)
  async blacklistToken(@Body() blacklistDto: BlacklistDto) {
    return this.authService.addToBlackList(blacklistDto);
  }
}
