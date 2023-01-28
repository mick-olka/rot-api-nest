import { Module } from '@nestjs/common'
import { PhotosController } from './photos.controller'
import { PhotosService } from './photos.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Collection, CollectionSchema } from '../../schemas/collection.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Collection.name, schema: CollectionSchema },
    ]),
  ],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}
