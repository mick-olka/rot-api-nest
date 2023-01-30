import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { default_locales, I_Locales } from 'src/schemas/data'

export class CreatePhotosDto {
  @ApiProperty({ required: false, default: default_locales })
  @IsString()
  readonly main_color: string // I_Locales

  @ApiProperty({ required: false, default: default_locales })
  @IsString()
  readonly pill_color: string // I_Locales

  @ApiProperty({
    type: ['string'],
    format: 'binary',
    required: true,
  })
  readonly files: File[]
}
