import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, IsPhoneNumber, IsOptional } from 'class-validator'
import { I_Locales, StatusEnum } from 'src/schemas/data'
import { default_cart_item, I_OrderItemDto, orderItem } from './data'

const notRequired = { required: false }

export class UpdateOrderDto {
  @ApiProperty(notRequired)
  @IsOptional()
  readonly name?: I_Locales

  @ApiProperty(notRequired)
  @IsOptional()
  @IsPhoneNumber()
  readonly phone?: string

  @ApiProperty(notRequired)
  @IsString()
  @IsOptional()
  readonly message?: string

  @ApiProperty(notRequired)
  @IsNumber()
  @IsOptional()
  readonly sum?: number

  @ApiProperty({ enum: StatusEnum, required: false })
  @IsOptional()
  readonly status?: string

  @ApiProperty({
    type: orderItem,
    required: false,
    isArray: true,
    default: [default_cart_item],
  })
  @IsOptional()
  readonly cart?: I_OrderItemDto[]
}
