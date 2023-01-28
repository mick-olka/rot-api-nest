import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { default_locales, I_Locales } from 'src/schemas/data'

export class UpdatePhotosDto {
  @ApiProperty({ required: false, default: default_locales })
  @IsString()
  readonly main_color: I_Locales

  @ApiProperty({ required: false, default: default_locales })
  @IsString()
  readonly pill_color: I_Locales

  // @ApiProperty({ required: true })
  // readonly files: File[]
}
