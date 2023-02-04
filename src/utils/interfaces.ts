import mongoose from 'mongoose'

export type MongoItem<T extends object> = T & { _id: mongoose.Types.ObjectId }

export interface File extends Blob {
  readonly lastModified: number
  readonly name: string
}
