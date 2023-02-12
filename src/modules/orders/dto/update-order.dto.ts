import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, IsPhoneNumber } from 'class-validator'
import { I_Locales, StatusEnum } from 'src/schemas/data'
import { default_cart_item, I_OrderItemDto, orderItem } from './data'

const notRequired = { required: false }

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

  @ApiProperty({
    type: orderItem,
    required: false,
    isArray: true,
    default: [default_cart_item],
  })
  readonly cart?: I_OrderItemDto[]
}
