import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { Order, OrderDocument } from 'src/schemas/order.schema'
import { Product } from 'src/schemas/product.schema'
import { PaginationQuery, PromisePaginationResT } from 'src/utils/interfaces'
import { getFilterForSearch } from 'src/utils/utils'

type OrderI = Order & { _id: mongoose.Types.ObjectId }

const populateProducts = {
  path: 'cart',
  populate: {
    path: 'product',
    model: Product.name,
    select: '_id name url_name price product thumbnail index',
  },
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly OrderModel: Model<OrderDocument>,
  ) {}

  async findAll({
    page = '1',
    limit = '20',
    regex,
  }: PaginationQuery): PromisePaginationResT<OrderI> {
    const p = Number(page),
      l = Number(limit)
    const count = await this.OrderModel.count()
    const filter = getFilterForSearch(regex, ['name', 'phone'])
    const items = await this.OrderModel.find(filter)
      .sort({ date: -1 })
      .skip((p - 1) * l)
      .limit(l)
    return { count, docs: items }
  }

  async findOne(id: string): Promise<OrderI> {
    return this.OrderModel.findOne({ _id: id })
      .populate(populateProducts)
      .exec()
  }

  async create(data: CreateOrderDto): Promise<OrderI> {
    const order_data = { ...data, date: new Date() }
    const createdItem = await this.OrderModel.create(order_data)
    return createdItem
  }

  async update(id: string, data: UpdateOrderDto): Promise<OrderI> {
    const updatedItem = await this.OrderModel.findOneAndUpdate(
      { _id: id },
      data,
      { new: true },
    )
    return updatedItem
  }

  async delete(id: string): Promise<OrderI> {
    const deletedItem = await this.OrderModel.findByIdAndRemove({
      _id: id,
    }).exec()
    return deletedItem
  }

  // @OnEvent(EVENTS.product_deleted)
  // async handleProductDeletedEvent(event: ProductDeletedEvent) {
  //   //
  // }
}
