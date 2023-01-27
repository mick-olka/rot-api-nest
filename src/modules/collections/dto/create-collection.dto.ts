import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsNumber } from 'class-validator'
import { default_locales, I_Locales, I_ProductFeatures } from 'src/schemas/data'
import { Product } from 'src/schemas/product.schema'

const notRequired = {
  required: false,
}

export class CreateCollectionDto {
  @ApiProperty({ required: false, default: default_locales })
  readonly name: I_Locales

  @ApiProperty(notRequired)
  @IsString()
  readonly url_name: string

  readonly items?: Product[]

  readonly keywords?: string[]

  readonly description?: I_Locales

  @ApiProperty(notRequired)
  @IsNumber()
  readonly index?: number
}
