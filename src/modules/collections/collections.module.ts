import { Module } from '@nestjs/common'
import { CollectionsController } from './collections.controller'
import { CollectionsService } from './collections.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Collection, CollectionSchema } from '../../schemas/collection.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Collection.name, schema: CollectionSchema },
    ]),
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [],
})
export class CollectionsModule {}
