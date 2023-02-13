import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsNumber } from 'class-validator'
import { default_locales, I_Locales, I_ProductFeatures } from 'src/schemas/data'
import { Product } from 'src/schemas/product.schema'
import { File } from 'src/utils/interfaces'

const notRequired = {
  required: false,
}

class ProductDto {
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

  @ApiProperty(notRequired)
  @IsString()
  readonly url_name?: string

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

export class CreateProductMultipartDto extends ProductDto {
  @ApiProperty({ default: default_locales })
  @IsString()
  readonly name: string

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  readonly thumbnail?: File
}

export class CreateProductDto extends ProductDto {
  readonly name: I_Locales
  readonly thumbnail?: string
}
