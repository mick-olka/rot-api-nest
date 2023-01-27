import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { getMongoRef, I_Locales, locales } from './data'
import { Product } from './product.schema'

export type CollectionDocument = HydratedDocument<Collection>

@Schema()
export class Collection {
  @Prop(locales)
  name: I_Locales

  @Prop({ unique: true })
  url_name: string

  @Prop(getMongoRef(Product.name, true))
  items: Product[]

  @Prop({ default: [], type: [String] })
  keywords: string[]

  @Prop({ required: false })
  description: string

  @Prop({ default: 0, required: false })
  index: number
}

export const CollectionSchema = SchemaFactory.createForClass(Collection)
