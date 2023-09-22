import { ApiProperty } from '@nestjs/swagger'
import mongoose from 'mongoose'

export type MongoItem<T extends object> = T & { _id: mongoose.Types.ObjectId }

export interface File extends Blob {
  readonly lastModified: number
  readonly name: string
}

export class PaginationQuery {
  @ApiProperty({
    default: 1,
    required: false,
  })
  page?: string

  @ApiProperty({
    default: 5,
    required: false,
  })
  limit?: string

  @ApiProperty({
    required: false,
  })
  regex?: string

  @ApiProperty({
    required: false,
  })
  all?: string
}

export interface I_PaginationRes<T> {
  count: number
  docs: T[]
}

export type PromisePaginationResT<T> = Promise<I_PaginationRes<T>>
