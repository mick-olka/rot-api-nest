import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsPhoneNumber,
  IsDateString,
  IsNumber,
  IsNotEmpty,
} from 'class-validator'
import { I_Locales, I_OrderItem, StatusEnum } from 'src/schemas/data'
import { default_cart_item, orderItem } from './data'

const notRequired = {
  required: false,
}

export class CreateOrderDto {
  @ApiProperty({ default: 'Matt Dock' })
  @IsString()
  @IsNotEmpty()
  readonly name: I_Locales

  @ApiProperty({ default: '+380963963930' })
  @IsPhoneNumber()
  @IsNotEmpty()
  readonly phone: string

  @ApiProperty(notRequired)
  @IsString()
  readonly message?: string

  @ApiProperty({ default: 1000 })
  @IsNumber()
  readonly sum: number

  @ApiProperty({ enum: StatusEnum, default: StatusEnum.w })
  readonly status: string

  @ApiProperty(notRequired)
  @IsDateString()
  readonly date?: string

  @ApiProperty({ type: orderItem, isArray: true, default: [default_cart_item] })
  readonly cart: I_OrderItem[]
}
