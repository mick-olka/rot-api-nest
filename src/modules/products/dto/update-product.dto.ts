import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator'
import { default_locales, I_Locales, I_ProductFeatures } from 'src/schemas/data'
import { Product } from 'src/schemas/product.schema'
import { File } from 'src/utils/interfaces'

const notRequired = {
  required: false,
}

class ProductDto {
  @ApiProperty(notRequired)
  url_name?: string

  @ApiProperty(notRequired)
  code?: string

  @ApiProperty(notRequired)
  @IsOptional()
  price?: number

  @ApiProperty(notRequired)
  old_price?: number

  keywords?: string[]

  features?: I_ProductFeatures

  photos?: string[]

  related_products?: string[]

  similar_products?: string[]

  collections?: string[]

  @ApiProperty(notRequired)
  index?: number
}

export class UpdateProductMultipartDto extends ProductDto {
  @ApiProperty({ default: default_locales, required: false })
  @IsOptional()
  @IsString()
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

export class UpdateProductRelatedDto {
  @ApiProperty({ type: [String], default: [] })
  @IsArray()
  readonly items?: string[]

  @ApiProperty({ enum: ['add', 'delete'], default: 'add' })
  @IsString()
  readonly action: 'add' | 'delete'

  @ApiProperty({ enum: ['similar', 'related'], default: 'related' })
  @IsString()
  readonly type: 'similar' | 'related'
}
