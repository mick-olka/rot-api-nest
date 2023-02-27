import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { CreateProductDto } from './dto/create-product.dto'
import { Product, ProductDocument } from '../../schemas/product.schema'
import { UpdateProductDto } from './dto/update-product.dto'
import { PaginationQuery, PromisePaginationResT } from 'src/utils/interfaces'
import { getFilterForSearch, getUrlNameFilter } from 'src/utils/utils'

type ProductI = Product & { _id: mongoose.Types.ObjectId }

const populateProductsSelector = '_id name url_name thumbnail price old_price'

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly ProductModel: Model<ProductDocument>,
  ) {}

  async findAll({
    page = 1,
    limit = 20,
    regex,
  }: PaginationQuery): PromisePaginationResT<ProductI> {
    const filter = getFilterForSearch(regex, ['code', 'name.ua', 'name.en'])
    const count = await this.ProductModel.count(filter)
    const items = await this.ProductModel.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
    return { count, docs: items }
  }

  async findOne(id: string): Promise<ProductI> {
    return await this.ProductModel.findOne(getUrlNameFilter(id))
      .populate('photos')
      .populate('related_products', populateProductsSelector)
      .populate('similar_products', populateProductsSelector)
      .exec()
  }

  async create(data: CreateProductDto): Promise<ProductI> {
    const createdProduct = await this.ProductModel.create(data)
    return createdProduct
  }

  async update(id: string, data: UpdateProductDto): Promise<ProductI> {
    const updatedItem = await this.ProductModel.findOneAndUpdate(
      { $or: [{ _id: id }, { url_name: id }] },
      data,
      { new: true },
    )
    return updatedItem
  }

  async delete(id: string): Promise<ProductI> {
    const deletedProduct = await this.ProductModel.findOneAndRemove({
      $or: [{ _id: id }, { url_name: id }],
    }).exec()
    return deletedProduct
  }
}
