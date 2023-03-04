import mongoose, { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CreatePhotosDto } from './dto/create-photos.dto'
import { UpdatePhotosDto } from './dto/update-photos.dto'
import {
  Photos as PhotosSchema,
  PhotosDocument,
} from 'src/schemas/photos.schema'
import { ProductsService } from '../products/products.service'

type PhotosI = PhotosSchema & { _id: mongoose.Types.ObjectId }

@Injectable()
export class PhotosService {
  constructor(
    @InjectModel(PhotosSchema.name)
    private readonly PhotosModel: Model<PhotosDocument>,
    private readonly productsService: ProductsService,
  ) {}

  async findAll(): Promise<PhotosI[]> {
    return this.PhotosModel.find().exec()
  }

  async findOne(id: string): Promise<PhotosI> {
    return this.PhotosModel.findOne({ _id: id }).exec()
  }

  async create(product_id: string, data: CreatePhotosDto): Promise<PhotosI> {
    const createdItem = await this.PhotosModel.create(data)
    await this.productsService.addPhotos(product_id, String(createdItem._id))
    return createdItem
  }

  async update(id: string, data: UpdatePhotosDto): Promise<PhotosI> {
    const updatedItem = await this.PhotosModel.findOneAndUpdate(
      { _id: id },
      data,
      { new: true },
    )
    return updatedItem
  }

  async delete(product_id: string, id: string): Promise<PhotosI> {
    const deletedItem = await this.PhotosModel.findByIdAndRemove({
      _id: id,
    }).exec()
    await this.productsService.removePhotos(product_id, id)
    return deletedItem
  }
}
