import { Module, forwardRef } from '@nestjs/common'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Product, ProductSchema } from '../../schemas/product.schema'
import { PhotosModule } from '../photos/photos.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    forwardRef(() => PhotosModule),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
