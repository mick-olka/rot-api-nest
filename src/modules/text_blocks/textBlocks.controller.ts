import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Param,
  Delete,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateTextBlockDto } from './dto/create-textBlock.dto'
import { UpdateTextBlockDto } from './dto/update-textBlock.dto'
import { TextBlocksService } from './textBlocks.service'
import { TextBlock } from 'src/schemas/text_block.schema'
import { AuthGuard } from '@nestjs/passport'
import { NotFoundInterceptor } from 'src/utils/injectables'

@ApiBearerAuth()
@ApiTags('Text_Blocks')
@Controller('text_blocks')
@UseInterceptors(NotFoundInterceptor)
export class TextBlocksController {
  constructor(private readonly textBlocksService: TextBlocksService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched text_blocks.',
  })
  async findAll(): Promise<TextBlock[]> {
    return this.textBlocksService.findAll()
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched text_block.',
  })
  getTodoById(@Param('id') id: string): Promise<TextBlock> {
    return this.textBlocksService.findOne(id)
  }

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created text_block.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async create(@Body() data: CreateTextBlockDto) {
    return this.textBlocksService.create(data)
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated text_block.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async update(@Param('id') id: string, @Body() data: UpdateTextBlockDto) {
    return this.textBlocksService.update(id, data)
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully deleted text_block.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async delete(@Param('id') id: string) {
    return this.textBlocksService.delete(id)
  }
}
