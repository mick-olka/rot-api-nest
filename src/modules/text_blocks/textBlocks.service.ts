import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { CreateTextBlockDto } from './dto/create-textBlock.dto'
import { TextBlock, TextBlockDocument } from '../../schemas/text_block.schema'
import { UpdateTextBlockDto } from './dto/update-textBlock.dto'

type TextBlockI = TextBlock & { _id: mongoose.Types.ObjectId }

@Injectable()
export class TextBlocksService {
  constructor(
    @InjectModel(TextBlock.name)
    private readonly TextBlockModel: Model<TextBlockDocument>,
  ) {}

  async findAll(): Promise<TextBlockI[]> {
    return this.TextBlockModel.find().exec()
  }

  async findOne(query: string): Promise<TextBlockI> {
    const filter: { _id?: string; name?: object | string } = {}
    if (mongoose.isValidObjectId(query)) {
      filter._id = query
    } else filter.name = { $regex: query }
    return this.TextBlockModel.findOne(filter).exec()
  }

  async create(data: CreateTextBlockDto): Promise<TextBlockI> {
    const createdItem = await this.TextBlockModel.create(data)
    return createdItem
  }

  async update(id: string, data: UpdateTextBlockDto): Promise<TextBlockI> {
    const updatedItem = await this.TextBlockModel.findOneAndUpdate(
      { _id: id },
      data,
      { new: true },
    )
    return updatedItem
  }

  async delete(id: string): Promise<TextBlockI> {
    const deletedItem = await this.TextBlockModel.findByIdAndRemove({
      _id: id,
    }).exec()
    return deletedItem
  }
}
