import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber } from 'class-validator'
import { default_locales, I_Locales } from 'src/schemas/data'
import { Product } from 'src/schemas/product.schema'

const notRequired = {
  required: false,
}

export class UpdateCollectionDto {
  @ApiProperty({ required: false, default: default_locales })
  readonly name: I_Locales

  @ApiProperty(notRequired)
  @IsString()
  readonly url_name: string

  readonly items?: Product[]

  readonly keywords?: string[]

  @ApiProperty({ required: false, default: default_locales })
  readonly description?: I_Locales

  @ApiProperty(notRequired)
  @IsNumber()
  readonly index?: number
}
