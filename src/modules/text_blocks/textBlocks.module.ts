import { Module } from '@nestjs/common'
import { TextBlocksController } from './textBlocks.controller'
import { TextBlocksService } from './textBlocks.service'
import { MongooseModule } from '@nestjs/mongoose'
import { TextBlock, TextBlockSchema } from '../../schemas/text_block.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TextBlock.name, schema: TextBlockSchema },
    ]),
  ],
  controllers: [TextBlocksController],
  providers: [TextBlocksService],
})
export class TextBlocksModule {}
