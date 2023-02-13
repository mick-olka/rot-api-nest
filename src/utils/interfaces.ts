import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'
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
  @IsNumber()
  page?: number

  @ApiProperty({
    default: 5,
    required: false,
  })
  @IsNumber()
  limit?: number

  @ApiProperty({
    required: false,
  })
  regex?: string
}

export interface I_PaginationRes<T> {
  count: number
  docs: T[]
}

export type PromisePaginationResT<T> = Promise<I_PaginationRes<T>>
