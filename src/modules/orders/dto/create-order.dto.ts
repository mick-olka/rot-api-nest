import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator'
import { I_Locales, StatusEnum } from 'src/schemas/data'
import { default_cart_item, I_OrderItemDto, orderItem } from './data'

const notRequired = { required: false }

export class CreateOrderDto {
  @ApiProperty({ default: 'Matt Dock' })
  @IsString()
  @IsNotEmpty()
  readonly name: I_Locales

  @ApiProperty({ default: '+380963963930' })
  @IsNotEmpty()
  @IsString()
  readonly phone: string

  @ApiProperty(notRequired)
  @IsOptional()
  @IsString()
  readonly message?: string

  @ApiProperty({ default: 1000 })
  @IsNumber()
  readonly sum: number

  @ApiProperty({ enum: StatusEnum, default: StatusEnum.w })
  @IsString()
  readonly status: string

  @ApiProperty({ type: orderItem, isArray: true, default: [default_cart_item] })
  @IsNotEmpty()
  readonly cart: I_OrderItemDto[]
}
