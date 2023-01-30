import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { default_locales, I_Locales } from 'src/schemas/data'

const notRequired = {
  required: false,
}

export class UpdateTextBlockDto {
  @ApiProperty(notRequired)
  @IsString()
  name?: string

  @ApiProperty({ required: false, default: default_locales })
  text?: I_Locales

  @ApiProperty(notRequired)
  font?: {
    size?: number
    weight?: number
    color?: number
  }

  @ApiProperty(notRequired)
  @IsString()
  url?: string
}
