import { Post, Body, HttpCode, UseGuards, Req } from '@nestjs/common/decorators'
import { Controller, HttpStatus } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { Request } from 'express'

import { AuthService } from './auth.service'
import { SignInDto, SignUpDto } from './dto'
import { Tokens } from './models'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully signed up.',
    type: SignUpDto,
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  signUpLocal(@Body() dto: SignUpDto): Promise<Tokens> {
    return this.authService.signUpLocal(dto)
  }

  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully signed up.',
    type: SignInDto,
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  signInLocal(@Body() dto: SignInDto): Promise<Tokens> {
    return this.authService.signInLocal(dto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully logged out.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  logout(@Req() req: Request): Promise<{ message: string }> {
    const user = req.user
    return this.authService.logout(user['sub'], user['email'])
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully refreshed token.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  refreshTokens(@Req() req: Request): Promise<{ new_token: string }> {
    const user = req.user
    return this.authService.refreshTokens(user['sub'], user['refreshToken'])
  }
}
