import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { StatusEnum, getMongoRef, I_Locales } from './data'
import { Product } from './product.schema'

export type OrderDocument = HydratedDocument<Order>

const status = {
  type: String,
  enum: StatusEnum,
  default: StatusEnum.w,
}

const orderItem = raw([
  {
    product: getMongoRef(Product.name),
    count: { type: String, default: 1 },
    main_color: { type: String, default: '' },
    pill_color: { type: String, default: '' },
  },
])

interface I_ProductPopulated {
  _id: string
  name: I_Locales
  url_name: string
  price: number
  thumbnail: string
  index: number
}

export interface I_OrderItem {
  product: I_ProductPopulated
  count: number
  main_color: string
  pill_color: string
}

@Schema()
export class Order {
  @Prop(String)
  name: string

  @Prop(String)
  phone: string

  @Prop(String)
  message: string

  @Prop(Number)
  sum: number

  @Prop(status)
  status: StatusEnum

  @Prop({ type: Date, default: new Date() })
  date: string

  @Prop(orderItem)
  cart: I_OrderItem[]
}

export const OrderSchema = SchemaFactory.createForClass(Order)
