import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { CreateCollectionDto } from './dto/create-collection.dto'
import { Collection, CollectionDocument } from '../../schemas/collection.schema'

type CollectionI = Collection & { _id: mongoose.Types.ObjectId }

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection.name)
    private readonly CollectionModel: Model<CollectionDocument>,
  ) {}

  async create(data: CreateCollectionDto): Promise<CollectionI> {
    const createdProduct = await this.CollectionModel.create(data)
    return createdProduct
  }

  async findAll(): Promise<CollectionI[]> {
    return this.CollectionModel.find().exec()
  }

  async findOne(id: string): Promise<CollectionI> {
    return this.CollectionModel.findOne({ _id: id }).exec()
  }

  async update(id: string, data: CreateCollectionDto): Promise<CollectionI> {
    return this.CollectionModel.findOneAndUpdate({ _id: id }, data)
  }

  async delete(id: string): Promise<CollectionI> {
    const deletedProduct = await this.CollectionModel.findByIdAndRemove({
      _id: id,
    }).exec()
    return deletedProduct
  }
}
