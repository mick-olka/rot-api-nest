import mongoose from 'mongoose'

export type MongoItem<T extends object> = T & { _id: mongoose.Types.ObjectId }
