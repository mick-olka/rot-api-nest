import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { CreateProductDto } from './dto/create-product.dto'
import { Product, ProductDocument } from '../../schemas/product.schema'
import { UpdateProductDto } from './dto/update-product.dto'
import { PaginationQuery, PromisePaginationResT } from 'src/utils/interfaces'
import { getFilterForSearch } from 'src/utils/utils'

type ProductI = Product & { _id: mongoose.Types.ObjectId }

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
    const count = await this.ProductModel.count()
    const items = await this.ProductModel.find(
      getFilterForSearch(regex, ['code', 'name.ua', 'name.en']),
    )
      .skip((page - 1) * limit)
      .limit(limit)
    return { count, docs: items }
  }

  async findOne(id: string): Promise<ProductI> {
    return await this.ProductModel.findOne({ _id: id })
      .populate('photos')
      .exec()
  }

  async create(data: CreateProductDto): Promise<ProductI> {
    const createdProduct = await this.ProductModel.create(data)
    return createdProduct
  }

  async update(id: string, data: UpdateProductDto): Promise<ProductI> {
    const updatedItem = await this.ProductModel.findOneAndUpdate(
      { _id: id },
      data,
      { new: true },
    )
    return updatedItem
  }

  async delete(id: string): Promise<ProductI> {
    const deletedProduct = await this.ProductModel.findByIdAndRemove({
      _id: id,
    }).exec()
    return deletedProduct
  }
}
