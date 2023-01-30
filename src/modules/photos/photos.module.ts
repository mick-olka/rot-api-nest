import { Module } from '@nestjs/common'
import { PhotosController } from './photos.controller'
import { PhotosService } from './photos.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Photos, PhotosSchema } from '../../schemas/photos.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Photos.name, schema: PhotosSchema }]),
  ],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}
