import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { CreateCollectionDto } from './dto/create-collection.dto'
import { Collection, CollectionDocument } from '../../schemas/collection.schema'
import { UpdateCollectionDto } from './dto/update-collection.dto'
import { getUrlNameFilter } from 'src/utils/utils'
import { OnEvent } from '@nestjs/event-emitter'
import { EVENTS } from 'src/utils/constants'
import { ProductDeletedEvent } from '../products/events/product-deleted.event'

type CollectionI = Collection & { _id: mongoose.Types.ObjectId }

const populateProducts = {
  path: 'items',
  select: '_id name url_name price old_price thumbnail index',
}

const getAllCollectionsSelector = '_id name url_name index'

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection.name)
    private readonly CollectionModel: Model<CollectionDocument>,
  ) {}

  async findAll(): Promise<CollectionI[]> {
    return this.CollectionModel.find().select(getAllCollectionsSelector).exec()
  }

  async findOne(id: string): Promise<CollectionI> {
    return this.CollectionModel.findOne(getUrlNameFilter(id))
      .populate(populateProducts)
      .exec()
  }

  async create(data: CreateCollectionDto): Promise<CollectionI> {
    const createdItem = await this.CollectionModel.create(data)
    return createdItem
  }

  async update(id: string, data: UpdateCollectionDto): Promise<CollectionI> {
    const updatedItem = await this.CollectionModel.findOneAndUpdate(
      getUrlNameFilter(id),
      data,
      { new: true },
    )
    return updatedItem
  }

  async delete(id: string): Promise<CollectionI> {
    const deletedItem = await this.CollectionModel.findOneAndRemove(
      getUrlNameFilter(id),
    ).exec()
    return deletedItem
  }

  @OnEvent(EVENTS.product_deleted)
  async handleProductDeletedEvent(event: ProductDeletedEvent) {
    // remove product from collections
    const p = event.product
    for (const i in p.collections) {
      let new_data = {}
      new_data = {
        $pullAll: [event.id],
      }
      await this.update(p.collections[i], new_data)
    }
  }
}
