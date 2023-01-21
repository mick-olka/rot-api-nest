import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsNumber } from 'class-validator'

export class UpdateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly price: number

  @ApiProperty({
    required: false,
  })
  @IsString()
  readonly description?: string
}
