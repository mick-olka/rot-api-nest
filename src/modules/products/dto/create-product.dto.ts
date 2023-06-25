import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
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
  // @IsNumber()
  price: number

  @ApiProperty(notRequired)
  @IsOptional()
  // @IsNumber()
  old_price?: number

  @ApiProperty(notRequired)
  @IsOptional()
  @IsString()
  url_name?: string

  @IsOptional()
  // @IsArray()
  keywords?: string[]

  @IsOptional()
  @IsString()
  description?: I_Locales

  @IsOptional()
  features?: I_ProductFeatures

  @IsOptional()
  @IsArray()
  photos?: string[]

  @IsOptional()
  @IsArray()
  related_products?: Product[]

  @IsOptional()
  @IsArray()
  similar_products?: Product[]

  @ApiProperty(notRequired)
  @IsOptional()
  // @IsNumber()
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
