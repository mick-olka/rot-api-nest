import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsNumber,
  IsPhoneNumber,
  IsDateString,
} from 'class-validator'
import { I_Locales, I_OrderItem, StatusEnum } from 'src/schemas/data'
import { default_cart_item, orderItem } from './data'

const notRequired = {
  required: false,
}

export class UpdateOrderDto {
  @ApiProperty(notRequired)
  @IsString()
  readonly name?: I_Locales

  @ApiProperty(notRequired)
  @IsPhoneNumber()
  readonly phone?: string

  @ApiProperty(notRequired)
  @IsString()
  readonly message?: string

  @ApiProperty(notRequired)
  @IsNumber()
  readonly sum?: number

  @ApiProperty({ enum: StatusEnum, required: false })
  readonly status?: string

  @ApiProperty(notRequired)
  @IsDateString()
  readonly date?: string

  @ApiProperty({
    type: orderItem,
    required: false,
    isArray: true,
    default: [default_cart_item],
  })
  readonly cart?: I_OrderItem[]
}
