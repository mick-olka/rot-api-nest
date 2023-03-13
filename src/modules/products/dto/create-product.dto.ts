import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
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
  code: string

  @ApiProperty()
  @IsNotEmpty()
  price: number

  @ApiProperty(notRequired)
  old_price?: number

  @ApiProperty(notRequired)
  @IsString()
  url_name?: string

  keywords?: string[]

  description?: I_Locales

  features?: I_ProductFeatures

  photos?: string[]

  related_products?: Product[]

  similar_products?: Product[]

  @ApiProperty(notRequired)
  index?: number
}

// for swagger
export class CreateProductMultipartDto extends ProductDto {
  @ApiProperty({ default: default_locales })
  @IsString()
  name: string

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  thumbnail?: File
}

// for internal use
export class CreateProductDto extends ProductDto {
  name: I_Locales
  thumbnail?: string
}
