import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly hash: string

  @ApiProperty({
    required: false,
  })
  @IsString()
  readonly hashedRt?: string
}
