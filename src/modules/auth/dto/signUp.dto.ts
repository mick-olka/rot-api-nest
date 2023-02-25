import { IsNotEmpty, IsEmail, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SignUpDto {
  @ApiProperty({
    description: 'New email',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'New password',
  })
  @IsNotEmpty()
  password: string

  @ApiProperty({
    description: 'Admin Key',
  })
  admin_key: string
}
