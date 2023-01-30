import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { I_Locales } from './data'

export type TextBlockDocument = HydratedDocument<TextBlock>

const localesNotRequired = raw({
  ua: { type: String, required: false },
  en: { type: String, required: false },
})

const fontFields = raw({
  size: { type: Number, required: false },
  weight: { type: Number, required: false },
  color: { type: String, required: false },
})

@Schema()
export class TextBlock {
  @Prop({ type: String, required: true, unique: true })
  name: string

  @Prop(localesNotRequired)
  text: I_Locales

  @Prop({ required: false, type: fontFields })
  font?: {
    size?: number
    weight?: number
    color?: number
  }

  @Prop({ required: false })
  url?: string
}

export const TextBlockSchema = SchemaFactory.createForClass(TextBlock)
