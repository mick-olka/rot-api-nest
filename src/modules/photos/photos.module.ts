import { Module } from '@nestjs/common'
import { PhotosController } from './photos.controller'
import { PhotosService } from './photos.service'
import { Photos, PhotosSchema } from 'src/schemas/photos.schema'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Photos.name, schema: PhotosSchema }]),
  ],
  controllers: [PhotosController],
  providers: [PhotosService],
  exports: [],
})
export class PhotosModule {}
