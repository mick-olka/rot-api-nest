import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateUserDto {
  @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  readonly email?: string

  @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  readonly hash?: string

  @ApiProperty({
    required: false,
  })
  @IsString()
  readonly hashedRt?: string
}
