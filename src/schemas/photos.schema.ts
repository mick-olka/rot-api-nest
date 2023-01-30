import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { I_Locales } from './data'

export type PhotosDocument = HydratedDocument<Photos>

export const localesNotRequired = raw({
  ua: { type: String, required: false },
  en: { type: String, required: false },
})

@Schema()
export class Photos {
  @Prop([{ type: String, required: true }])
  path_arr: string[]

  @Prop(localesNotRequired)
  main_color: I_Locales

  @Prop(localesNotRequired)
  pill_color: I_Locales
}

export const PhotosSchema = SchemaFactory.createForClass(Photos)
