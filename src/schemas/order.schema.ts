import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { locales, I_OrderItem, StatusEnum, getMongoRef } from './data'
import { Product } from './product.schema'

export type OrderDocument = HydratedDocument<Order>

const status = {
  type: String,
  enum: StatusEnum,
  default: StatusEnum.w,
}

const orderItem = raw({
  product: getMongoRef(Product.name),
  count: { type: String, default: 1 },
  main_color: { type: String, default: '' },
  pill_color: { type: String, default: '' },
})

@Schema()
export class Order {
  @Prop(locales)
  name: string

  @Prop(locales)
  phone: string

  @Prop(locales)
  message: string

  @Prop(Number)
  sum: number

  @Prop(status)
  status: StatusEnum

  @Prop({ type: Date, default: Date() })
  date: string

  @Prop(orderItem)
  cart: I_OrderItem[]
}

export const OrderSchema = SchemaFactory.createForClass(Order)
