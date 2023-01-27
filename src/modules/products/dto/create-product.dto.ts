import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsNumber } from 'class-validator'
import { default_locales, I_Locales, I_ProductFeatures } from 'src/schemas/data'
import { Product } from 'src/schemas/product.schema'

const notRequired = {
  required: false,
}

export class CreateProductDto {
  @ApiProperty({ default: default_locales })
  @IsNotEmpty()
  readonly name: I_Locales

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly url_name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly code: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly price: number

  @ApiProperty(notRequired)
  @IsNumber()
  readonly old_price?: number

  readonly thumbnail?: string

  readonly keywords?: string[]

  readonly description?: I_Locales

  readonly features?: I_ProductFeatures

  readonly photos?: string[]

  readonly related_products?: Product[]

  readonly similar_products?: Product[]

  @ApiProperty(notRequired)
  @IsNumber()
  readonly index?: number
}
