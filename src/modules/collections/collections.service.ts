import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { CreateCollectionDto } from './dto/create-collection.dto'
import { Collection, CollectionDocument } from '../../schemas/collection.schema'
import {
  UpdateCollectionDto,
  UpdateCollectionItemsDto,
} from './dto/update-collection.dto'
import { getUrlNameFilter } from 'src/utils/utils'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { EVENTS } from 'src/utils/constants'
import { ProductDeletedEvent } from '../products/events/product-deleted.event'
import { CollectionItemsUpdatedEvent } from './events/collection-items-updated.event'

type CollectionI = Collection & { _id: mongoose.Types.ObjectId }

const populateProducts = {
  path: 'items',
  select: '_id name url_name price old_price thumbnail index active',
  options: { sort: { index: 'asc' } },
  match: {},
}

const getAllCollectionsSelector = '_id name url_name index'

@Injectable()
export class CollectionsService {
  constructor(
    private eventEmitter: EventEmitter2,
    @InjectModel(Collection.name)
    private readonly CollectionModel: Model<CollectionDocument>,
  ) {}

  async findAll(): Promise<CollectionI[]> {
    return this.CollectionModel.find()
      .sort({ index: 'asc' })
      .select(getAllCollectionsSelector)
      .exec()
  }

  async findOne(id: string, all?: string): Promise<CollectionI> {
    // match: { active: { $ne: false } },
    const pop = { ...populateProducts }
    if (!all) pop.match = { active: { $ne: false } }
    return this.CollectionModel.findOne(getUrlNameFilter(id))
      .populate(pop)
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

  async updateItems(
    id: string,
    data: UpdateCollectionItemsDto,
  ): Promise<CollectionI> {
    let update_data = {}
    if (data.action === 'add')
      update_data = { $addToSet: { items: data.items } }
    else update_data = { $pullAll: { items: data.items } }
    const updatedItem = await this.CollectionModel.findOneAndUpdate(
      getUrlNameFilter(id),
      update_data,
      { new: true },
    )
    const collectionItemsUpdatedEvent = new CollectionItemsUpdatedEvent(
      id,
      data,
    )
    this.eventEmitter.emit(
      EVENTS.collection_items_updated,
      collectionItemsUpdatedEvent,
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
    const p = event.data
    for (const i in p.collections) {
      await this.updateItems(p.collections[i], {
        items: [event.id],
        action: 'delete',
      })
    }
  }
}
