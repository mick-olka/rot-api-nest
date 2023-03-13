import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { default_locales, I_Locales, I_ProductFeatures } from 'src/schemas/data'
import { Product } from 'src/schemas/product.schema'
import { File } from 'src/utils/interfaces'

const notRequired = {
  required: false,
}

class ProductDto {
  @ApiProperty(notRequired)
  readonly url_name?: string

  @ApiProperty(notRequired)
  readonly code?: string

  @ApiProperty(notRequired)
  readonly price?: number

  @ApiProperty(notRequired)
  readonly old_price?: number

  readonly keywords?: string[]

  readonly features?: I_ProductFeatures

  readonly photos?: string[]

  readonly related_products?: Product[]

  readonly similar_products?: Product[]

  @ApiProperty(notRequired)
  readonly index?: number
}

export class UpdateProductMultipartDto extends ProductDto {
  @ApiProperty({ default: default_locales, required: false })
  @IsNotEmpty()
  readonly name?: string

  @ApiProperty({ default: default_locales, required: false })
  readonly description?: string

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
