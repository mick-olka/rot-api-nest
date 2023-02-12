import { Photos } from './photos.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import {
  productFeatures,
  I_Locales,
  I_ProductFeatures,
  locales,
  default_features,
  getMongoRef,
} from './data'

export type ProductDocument = HydratedDocument<Product>

@Schema()
export class Product {
  @Prop(locales)
  name: I_Locales

  @Prop({ unique: true })
  url_name: string

  @Prop({ unique: true })
  code: string

  @Prop(Number)
  price: number

  @Prop({ required: false })
  old_price: number

  @Prop({ required: false })
  thumbnail: string

  @Prop({ type: [String], default: [] })
  keywords: string[]

  @Prop({ type: locales, required: false })
  description: I_Locales

  @Prop({ type: productFeatures, default: default_features })
  features: I_ProductFeatures

  @Prop(getMongoRef(Photos.name, true))
  photos: Photos[]

  @Prop(getMongoRef(Product.name, true))
  related_products: Product[]

  @Prop(getMongoRef(Product.name, true))
  similar_products: Product[]

  @Prop({ default: 0, required: false })
  index: number
}

export const ProductSchema = SchemaFactory.createForClass(Product)
