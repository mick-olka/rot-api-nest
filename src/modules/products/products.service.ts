import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { CreateProductDto } from './dto/create-product.dto'
import { Product, ProductDocument } from '../../schemas/product.schema'
import { UpdateProductDto } from './dto/update-product.dto'

type ProductI = Product & { _id: mongoose.Types.ObjectId }

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly ProductModel: Model<ProductDocument>,
  ) {}

  async findAll(): Promise<ProductI[]> {
    return this.ProductModel.find().exec()
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
