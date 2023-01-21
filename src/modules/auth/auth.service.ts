import { ConfigService } from '@nestjs/config'
import { ForbiddenException } from '@nestjs/common/exceptions'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import * as bcrypt from 'bcrypt'

import { SignUpDto } from './dto'
import { Tokens } from './models'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signUpLocal(dto: SignUpDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password)

    const newUser = await this.userService.create({
      email: dto.email,
      hash,
    })

    const tokens = await this.getTokens(String(newUser._id), newUser.email)
    await this.updateRefreshToken(String(newUser._id), tokens.refresh_token)
    return tokens
  }

  async signInLocal(dto: SignUpDto): Promise<Tokens> {
    const user = await this.userService.findOne({
      email: dto.email,
    })

    if (!user) throw new ForbiddenException('Access denied')

    const passwordMatches = await bcrypt.compare(dto.password, user.hash)

    if (!passwordMatches) throw new ForbiddenException('Access denied')

    const tokens = await this.getTokens(String(user._id), user.email)
    await this.updateRefreshToken(String(user._id), tokens.refresh_token)
    return tokens
  }

  async logout(
    userId: string,
    userEmail: string,
  ): Promise<{ message: string }> {
    await this.userService.updateOne(
      {
        _id: userId,
        hashedRt: {
          $ne: null,
        },
      },
      {
        hashedRt: null,
      },
    )

    return {
      message: `Success, logged out ${userEmail}`,
    }
  }

  async refreshTokens(
    userId: string,
    rt: string,
  ): Promise<{ new_token: string }> {
    const user = await this.userService.findById(userId)
    if (!user) throw new ForbiddenException('Access denied')

    const refreshTokenMatches = await bcrypt.compare(rt, user.hashedRt)

    if (!refreshTokenMatches) throw new ForbiddenException('Access denied')

    const tokens = await this.getTokens(String(user._id), user.email)
    await this.updateRefreshToken(String(user._id), tokens.refresh_token)

    return {
      new_token: tokens.access_token,
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hash = await this.hashData(refreshToken)
    await this.userService.updateOneById(userId, {
      hashedRt: hash,
    })
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10)
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ])

    return {
      access_token: at,
      refresh_token: rt,
    }
  }
}
