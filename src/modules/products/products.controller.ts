import { parseFormDataToJSON, transliterate } from './../../utils/utils'
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
  UseInterceptors,
  UploadedFile,
  Query,
  UseGuards,
  HttpException,
  Put,
  Header,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { CreateProductMultipartDto } from './dto/create-product.dto'
import {
  UpdateProductMultipartDto,
  UpdateProductRelatedDto,
} from './dto/update-product.dto'
import { ProductsService } from './products.service'
import { Product } from 'src/schemas/product.schema'
import { preparePhotos, thumbnailInterceptor } from 'src/utils/utils'
import { PromisePaginationResT } from 'src/utils/interfaces'
import mongoose from 'mongoose'
import { AuthGuard } from '@nestjs/passport'
import { NotFoundInterceptor } from 'src/utils/injectables'
import { deleteFile } from 'src/utils/files'

type ProductI = Product & { _id: mongoose.Types.ObjectId }

@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
@UseInterceptors(NotFoundInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched products.',
  })
  @ApiQuery({
    name: 'page',
    type: String,
    description: 'Products page',
    example: '1',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: String,
    description: 'Products limit',
    example: '3',
    required: false,
  })
  @ApiQuery({
    name: 'regex',
    type: String,
    description: 'Products search',
    required: false,
  })
  @ApiQuery({
    name: 'all',
    type: String,
    description: 'Show hidden',
    required: false,
  })
  async findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('regex') regex: string,
    @Query('all') all: string,
  ): PromisePaginationResT<ProductI> {
    return this.productsService.findAll({ page, limit, regex, all })
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched product.',
  })
  getById(@Param('id') id: string): Promise<ProductI> {
    return this.productsService.findOne(id)
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(thumbnailInterceptor)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created product.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async create(
    @Body() data: CreateProductMultipartDto,
    @UploadedFile() thumbnail: Express.Multer.File,
  ): Promise<ProductI> {
    const product_data: any = parseFormDataToJSON(data)
    if (product_data.collections) {
      throw new HttpException(
        'Forbidden field "collections". Use PUT api/collections/ to update collection items',
        HttpStatus.BAD_REQUEST,
      )
    }
    if (!product_data.url_name)
      product_data.url_name = transliterate(product_data.name.ua)
    if (thumbnail) {
      preparePhotos([thumbnail], 640)
      product_data.thumbnail = thumbnail.filename
    }
    return this.productsService.create(product_data)
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(thumbnailInterceptor)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated product.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateProductMultipartDto,
    @UploadedFile() thumbnail: Express.Multer.File,
  ): Promise<ProductI> {
    const p_dat: any = parseFormDataToJSON(data)
    if (thumbnail) {
      preparePhotos([thumbnail], 640)
      p_dat.thumbnail = thumbnail.filename
      const prevProd = await this.productsService.findOne(id)
      const prevThumbnail = prevProd.thumbnail
      deleteFile(prevThumbnail)
    }
    return this.productsService.update(id, p_dat)
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated product items.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async updateItems(
    @Param('id') id: string,
    @Body() data: UpdateProductRelatedDto,
  ) {
    let update_data = {}
    if (data.action === 'add')
      update_data = {
        $addToSet:
          data.type === 'similar'
            ? { similar_products: data.items }
            : { related_products: data.items },
      }
    else {
      update_data = {
        $pullAll:
          data.type === 'similar'
            ? { similar_products: data.items }
            : { related_products: data.items },
      }
    }
    return this.productsService.update(id, update_data)
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully deleted product.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async delete(@Param('id') id: string): Promise<ProductI> {
    const data = await this.productsService.findOne(id)
    if (data) {
      if (data.thumbnail) {
        deleteFile(data.thumbnail)
      }
    }
    return this.productsService.delete(id)
  }

  // @Get('rename/all')
  // @HttpCode(HttpStatus.OK)
  // // @Header('content-type', 'application/json')
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successfully transferred product.',
  // })
  // transferAllProducts(): Promise<object> {
  //   return this.productsService.renamePhotos()
  // }
}
