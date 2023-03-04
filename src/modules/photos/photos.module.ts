import { Module } from '@nestjs/common'
import { PhotosController } from './photos.controller'
import { PhotosService } from './photos.service'
import { ProductsModule } from '../products/products.module'
import { Photos, PhotosSchema } from 'src/schemas/photos.schema'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Photos.name, schema: PhotosSchema }]),
    ProductsModule,
  ],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}
