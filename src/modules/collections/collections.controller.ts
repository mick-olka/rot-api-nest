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
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateCollectionDto } from './dto/create-collection.dto'
import { UpdateCollectionDto } from './dto/update-collection.dto'
import { CollectionsService } from './collections.service'
import { Collection } from 'src/schemas/collection.schema'

@ApiTags('Collections')
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched collections.',
  })
  async findAll(): Promise<Collection[]> {
    return this.collectionsService.findAll()
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched collection.',
  })
  //   @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  getTodoById(@Param('id') id: string): Promise<Collection> {
    return this.collectionsService.findOne(id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created collection.',
  })
  //   @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async create(@Body() data: CreateCollectionDto) {
    return this.collectionsService.create(data)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated collection.',
  })
  //   @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async update(@Param('id') id: string, @Body() data: UpdateCollectionDto) {
    return this.collectionsService.update(id, data)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully deleted collection.',
  })
  async delete(@Param('id') id: string) {
    return this.collectionsService.delete(id)
  }
}
