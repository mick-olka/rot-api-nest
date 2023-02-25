import { IsNotEmpty, IsEmail, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SignInDto {
  @ApiProperty({
    description: 'Email of existing account',
    default: 'mick@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Password of existing account',
    default: '1234',
  })
  @IsNotEmpty()
  @IsString()
  password: string
}
