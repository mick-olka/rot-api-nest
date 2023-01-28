import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { I_Locales, locales } from './data'

export type PhotosDocument = HydratedDocument<Photos>

@Schema()
export class Photos {
  @Prop([{ type: String, required: true }])
  path_arr: string[]

  @Prop(locales)
  main_color: I_Locales

  @Prop(locales)
  pill_color: I_Locales
}

export const PhotosSchema = SchemaFactory.createForClass(Photos)
