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
  Put,
} from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateCollectionDto } from './dto/create-collection.dto'
import {
  UpdateCollectionDto,
  UpdateCollectionItemsDto,
} from './dto/update-collection.dto'
import { CollectionsService } from './collections.service'
import { Collection } from 'src/schemas/collection.schema'
import { AuthGuard } from '@nestjs/passport'
import { NotFoundInterceptor } from 'src/utils/injectables'
import { transliterate } from 'src/utils/utils'

@ApiBearerAuth()
@ApiTags('Collections')
@Controller('collections')
@UseInterceptors(NotFoundInterceptor)
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
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created collection.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async create(@Body() data: CreateCollectionDto) {
    const create_data = { ...data }
    if (!data.url_name) {
      create_data.url_name = transliterate(data.name.ua)
    }
    return this.collectionsService.create(create_data)
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated collection.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async update(@Param('id') id: string, @Body() data: UpdateCollectionDto) {
    return this.collectionsService.update(id, data)
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated collection.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async updateItems(
    @Param('id') id: string,
    @Body() data: UpdateCollectionItemsDto,
  ) {
    let update_data = {}
    if (data.action === 'add')
      update_data = { $addToSet: { items: data.items } }
    else update_data = { $pullAll: { items: data.items } }
    return this.collectionsService.update(id, update_data)
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully deleted collection.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async delete(@Param('id') id: string) {
    return this.collectionsService.delete(id)
  }
}
