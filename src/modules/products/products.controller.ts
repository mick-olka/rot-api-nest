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
} from '@nestjs/common'
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateProductMultipartDto } from './dto/create-product.dto'
import { UpdateProductMultipartDto } from './dto/update-product.dto'
import { ProductsService } from './products.service'
import { Product } from 'src/schemas/product.schema'
import { preparePhotos, thumbnailInterceptor } from 'src/utils/utils'
import cyrillicToTranslit from 'cyrillic-to-translit-js'
import { PaginationQuery, PromisePaginationResT } from 'src/utils/interfaces'
import mongoose from 'mongoose'

type ProductI = Product & { _id: mongoose.Types.ObjectId }

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched products.',
  })
  async findAll(
    @Query() query: PaginationQuery,
  ): PromisePaginationResT<ProductI> {
    return this.productsService.findAll(query)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched product.',
  })
  //   @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  getTodoById(@Param('id') id: string): Promise<ProductI> {
    return this.productsService.findOne(id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(thumbnailInterceptor)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created product.',
  })
  async create(
    @Body() data: CreateProductMultipartDto,
    @UploadedFile() thumbnail: Express.Multer.File,
  ): Promise<ProductI> {
    const product_data: any = { ...data }
    product_data.name = JSON.parse(data.name)
    if (thumbnail) {
      preparePhotos([thumbnail], 640)
      product_data.thumbnail = thumbnail.path
    }
    if (!product_data.url_name) {
      product_data.url_name = cyrillicToTranslit()
        .transform(product_data.name.ua, '_')
        .toLowerCase()
    }
    return this.productsService.create(product_data)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(thumbnailInterceptor)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated product.',
  })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateProductMultipartDto,
    @UploadedFile() thumbnail: Express.Multer.File,
  ): Promise<ProductI> {
    const product_data: any = { ...data }
    product_data.name = JSON.parse(data.name)
    if (thumbnail) {
      preparePhotos([thumbnail], 640)
      product_data.thumbnail = thumbnail.path
    }
    return this.productsService.update(id, product_data)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully deleted product.',
  })
  async delete(@Param('id') id: string): Promise<ProductI> {
    return this.productsService.delete(id)
  }
}
