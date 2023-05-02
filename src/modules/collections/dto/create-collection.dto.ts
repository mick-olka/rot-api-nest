import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsNumber,
  IsNotEmptyObject,
  IsOptional,
  IsArray,
} from 'class-validator'
import { default_locales, I_Locales } from 'src/schemas/data'
import { Product } from 'src/schemas/product.schema'

const notRequired = {
  required: false,
}

export class CreateCollectionDto {
  @ApiProperty({ default: default_locales })
  @IsNotEmptyObject()
  readonly name: I_Locales

  @ApiProperty(notRequired)
  @IsOptional()
  @IsString()
  readonly url_name?: string

  @IsOptional()
  @IsArray()
  readonly items?: Product[]

  @IsOptional()
  @IsArray()
  readonly keywords?: string[]

  @IsOptional()
  readonly description?: I_Locales

  @ApiProperty(notRequired)
  @IsOptional()
  @IsNumber()
  readonly index?: number
}
