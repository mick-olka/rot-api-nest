import { Module } from '@nestjs/common'
import { CollectionsController } from './collections.controller'
import { CollectionsService } from './collections.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Collection, CollectionSchema } from '../../schemas/collection.schema'
import { ProductsModule } from '../products/products.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Collection.name, schema: CollectionSchema },
    ]),
    ProductsModule,
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
