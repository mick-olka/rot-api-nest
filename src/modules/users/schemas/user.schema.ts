import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, now } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
  @Prop({ type: Date, default: now() })
  createdAt: string

  @Prop({ type: Date, default: now() })
  updatedAt: string

  @Prop({ type: String })
  email: string

  @Prop({ type: String })
  hash: string

  @Prop({ type: String, required: false })
  hashedRt: string
}

export const UserSchema = SchemaFactory.createForClass(User)
