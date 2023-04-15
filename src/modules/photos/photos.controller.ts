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
  UploadedFiles,
  ParseFilePipe,
  UseGuards,
  Query,
  HttpException,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { CreatePhotoMultipartDto } from './dto/create-photos.dto'
import { UpdatePhotoMultipartDto } from './dto/update-photos.dto'
import { PhotosService } from './photos.service'
import { Photos } from 'src/schemas/photos.schema'
import { photosInterceptor, preparePhotos } from 'src/utils/utils'
import { AuthGuard } from '@nestjs/passport'
import { NotFoundInterceptor } from 'src/utils/injectables'

@ApiBearerAuth()
@ApiTags('Photos')
@Controller('photos')
@UseInterceptors(NotFoundInterceptor)
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched photos.',
  })
  async findAll(): Promise<Photos[]> {
    return this.photosService.findAll()
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched photos.',
  })
  getTodoById(@Param('id') id: string): Promise<Photos> {
    return this.photosService.findOne(id)
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created photos.',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(photosInterceptor)
  @ApiQuery({
    name: 'product_id',
    type: String,
    description: 'Bind photos to product',
    required: true,
  })
  async create(
    @Query('product_id') product_id: string,
    @Body() data: CreatePhotoMultipartDto,
    @UploadedFiles(new ParseFilePipe({ validators: [] }))
    files: Array<Express.Multer.File>,
  ) {
    if (!product_id)
      throw new HttpException(
        'product_id must be provided in query',
        HttpStatus.BAD_REQUEST,
      )
    const photos_data = {
      main_color: undefined,
      pill_color: undefined,
      path_arr: [],
    }
    Object.entries(data).forEach(([key, value]) => {
      photos_data[key] = JSON.parse(value)
    })
    preparePhotos(files, 1200)
    photos_data.path_arr = files.map((f) => f.filename)
    return this.photosService.create(product_id, photos_data)
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update photos group with or add photos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated photos.',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(photosInterceptor)
  async update(
    @Param('id') id: string,
    @Body() data: UpdatePhotoMultipartDto,
    @UploadedFiles(new ParseFilePipe({ validators: [] }))
    files: Express.Multer.File[],
  ) {
    const photos_data: Partial<Photos> = {}
    Object.entries(data).forEach(([key, value]) => {
      photos_data[key] = JSON.parse(value)
    })
    // if new files then add to set
    if (files.length) {
      photos_data.path_arr = files.map((f) => f.filename)
      preparePhotos(files, 1200)
    }
    return this.photosService.update(id, photos_data, files)
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully deleted photos.',
  })
  @ApiQuery({
    name: 'product_id',
    type: String,
    description: 'Delete binded photos from product',
    required: true,
  })
  async delete(
    @Query('product_id') product_id: string,
    @Param('id') id: string,
  ) {
    if (!product_id)
      throw new HttpException(
        'product_id must be provided in query',
        HttpStatus.BAD_REQUEST,
      )
    return this.photosService.delete(product_id, id)
  }

  @Delete('photo/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove photo from group' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully deleted photos.',
  })
  @ApiQuery({
    name: 'filename',
    type: String,
    description: 'Delete photos from photos',
    required: true,
  })
  async deletePhoto(
    @Param('id') id: string,
    @Query('filename') filename: string,
  ) {
    return this.photosService.deletePhoto(id, filename)
  }
}
