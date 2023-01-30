import mongoose, { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CreatePhotosDto } from './dto/create-photos.dto'
import { UpdatePhotosDto } from './dto/update-photos.dto'
import {
  Photos as PhotosSchema,
  PhotosDocument,
} from 'src/schemas/photos.schema'

type PhotosI = PhotosSchema & { _id: mongoose.Types.ObjectId }

@Injectable()
export class PhotosService {
  constructor(
    @InjectModel(PhotosSchema.name)
    private readonly PhotosModel: Model<PhotosDocument>,
  ) {}

  async findAll(): Promise<PhotosI[]> {
    return this.PhotosModel.find().exec()
  }

  async findOne(id: string): Promise<PhotosI> {
    return this.PhotosModel.findOne({ _id: id }).exec()
  }

  async create(data: CreatePhotosDto): Promise<PhotosI> {
    const createdItem = await this.PhotosModel.create(data)
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

  async delete(id: string): Promise<PhotosI> {
    const deletedItem = await this.PhotosModel.findByIdAndRemove({
      _id: id,
    }).exec()
    return deletedItem
  }
}
