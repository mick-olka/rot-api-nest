import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { I_Locales, locales } from './data'

export type PhotosDocument = HydratedDocument<Photos>

@Schema()
export class Photos {
  @Prop([{ type: String, required: true }])
  pathArr: string[]

  @Prop(locales)
  mainColor: I_Locales

  @Prop(locales)
  pillColor: I_Locales
}

export const PhotosSchema = SchemaFactory.createForClass(Photos)
