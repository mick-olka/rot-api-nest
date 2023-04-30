import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { CreateProductDto } from './dto/create-product.dto'
import { Product, ProductDocument } from '../../schemas/product.schema'
import { UpdateProductDto } from './dto/update-product.dto'
import { PaginationQuery, PromisePaginationResT } from 'src/utils/interfaces'
import { getFilterForSearch, getUrlNameFilter } from 'src/utils/utils'
import { PhotosService } from '../photos/photos.service'
import { CollectionsService } from '../collections/collections.service'

type ProductI = Product & { _id: mongoose.Types.ObjectId }

const populateProductsSelector = '_id name url_name thumbnail price old_price'

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly ProductModel: Model<ProductDocument>, // private readonly photosService: PhotosService,
    @Inject(forwardRef(() => PhotosService))
    private readonly photosService: PhotosService,
    @Inject(forwardRef(() => CollectionsService))
    private readonly collectionsService: CollectionsService,
  ) {}

  async findAll({
    page = '1',
    limit = '20',
    regex,
  }: PaginationQuery): PromisePaginationResT<ProductI> {
    const p = Number(page),
      l = Number(limit)
    const filter = getFilterForSearch(regex, ['code', 'name.ua', 'name.en'])
    const count = await this.ProductModel.count(filter)
    const items = await this.ProductModel.find(filter)
      .skip((p - 1) * l)
      .limit(l)
    return { count, docs: items }
  }

  async findOne(id: string): Promise<ProductI> {
    return await this.ProductModel.findOne(getUrlNameFilter(id))
      .populate('photos')
      .populate('related_products', populateProductsSelector)
      .populate('similar_products', populateProductsSelector)
  }

  async create(data: CreateProductDto): Promise<ProductI> {
    const createdProduct = await this.ProductModel.create(data)
    return createdProduct
  }

  async update(id: string, data: UpdateProductDto): Promise<ProductI> {
    const updatedItem = await this.ProductModel.findOneAndUpdate(
      getUrlNameFilter(id),
      data,
      { new: true },
    )
    return updatedItem
  }

  async delete(id: string): Promise<ProductI> {
    const deletedProduct = await this.ProductModel.findOneAndRemove(
      getUrlNameFilter(id),
    )
    // remove product from collections
    for (const i in deletedProduct.collections) {
      let new_data = {}
      new_data = {
        $pullAll: [id],
      }
      await this.collectionsService.update(
        deletedProduct.collections[i],
        new_data,
      )
    }
    // delete all photos
    for (const i in deletedProduct.photos) {
      await this.photosService.delete(
        String(deletedProduct._id),
        deletedProduct.photos[i],
      )
    }
    return deletedProduct
  }

  async addPhotos(id: string, photos_id: string): Promise<ProductI> {
    const updatedProduct = await this.ProductModel.findByIdAndUpdate(id, {
      $addToSet: { photos: photos_id },
    })
    return updatedProduct
  }

  async removePhotos(id: string, photos_id: string): Promise<ProductI> {
    const updatedProduct = await this.ProductModel.findByIdAndUpdate(id, {
      $pull: { photos: photos_id },
    })
    return updatedProduct
  }
}
