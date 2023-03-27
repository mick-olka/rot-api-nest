import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsOptional, IsString } from 'class-validator'
import { default_locales, I_Locales } from 'src/schemas/data'
import { Product } from 'src/schemas/product.schema'

const notRequired = {
  required: false,
}

export class UpdateCollectionDto {
  @ApiProperty({ required: false, default: default_locales })
  @IsOptional()
  readonly name?: I_Locales

  @ApiProperty(notRequired)
  // @IsString()
  readonly url_name?: string

  readonly items?: Product[]

  readonly keywords?: string[]

  @ApiProperty({ required: false, default: default_locales })
  readonly description?: I_Locales

  @ApiProperty(notRequired)
  // @IsNumber()
  readonly index?: number
}

export class UpdateCollectionItemsDto {
  @ApiProperty({ type: [String], default: [] })
  @IsArray()
  readonly items?: string[]

  @ApiProperty({ enum: ['add', 'delete'], default: 'add' })
  @IsString()
  readonly action: 'add' | 'delete'
}
