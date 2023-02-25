import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber } from 'class-validator'
import { default_locales, I_Locales, I_ProductFeatures } from 'src/schemas/data'
import { Product } from 'src/schemas/product.schema'
import { File } from 'src/utils/interfaces'

const notRequired = {
  required: false,
}

class ProductDto {
  @ApiProperty(notRequired)
  @IsString()
  readonly url_name?: string

  @ApiProperty(notRequired)
  @IsString()
  readonly code?: string

  @ApiProperty(notRequired)
  @IsNumber()
  readonly price?: number

  @ApiProperty(notRequired)
  @IsNumber()
  readonly old_price?: number

  readonly keywords?: string[]

  readonly features?: I_ProductFeatures

  readonly photos?: string[]

  readonly related_products?: Product[]

  readonly similar_products?: Product[]

  @ApiProperty(notRequired)
  @IsNumber()
  readonly index?: number
}

export class UpdateProductMultipartDto extends ProductDto {
  @ApiProperty({ default: default_locales, required: false })
  @IsString()
  readonly name: string

  @ApiProperty({ default: default_locales, required: false })
  @IsString()
  readonly description: string

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  readonly thumbnail?: File
}

export class UpdateProductDto extends ProductDto {
  readonly name?: I_Locales
  readonly description?: I_Locales
  readonly thumbnail?: string
}
