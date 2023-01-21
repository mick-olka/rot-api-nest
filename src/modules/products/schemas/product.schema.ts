import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type ProductDocument = HydratedDocument<Product>

@Schema()
export class Product {
  @Prop(String)
  name: string

  @Prop(Number)
  price: number

  @Prop({ required: false })
  description: string
}

export const ProductSchema = SchemaFactory.createForClass(Product)
