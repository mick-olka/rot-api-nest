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
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreatePhotosDto } from './dto/create-photos.dto'
import { UpdatePhotosDto } from './dto/update-photos.dto'
import { PhotosService } from './photos.service'
import { Photos } from 'src/schemas/photos.schema'
import { FilesInterceptor } from '@nestjs/platform-express'

@ApiTags('Photos')
@Controller('photos')
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
    description: 'Successfully fetched collection.',
  })
  //   @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  getTodoById(@Param('id') id: string): Promise<Photos> {
    return this.photosService.findOne(id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created collection.',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  //   @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async create(
    @Body() data: CreatePhotosDto,
    @UploadedFiles(new ParseFilePipe({ validators: [] }))
    files: Array<Express.Multer.File>,
  ) {
    const photos_data: Partial<Photos> = {}
    Object.entries(data).forEach(([key, value]) => {
      photos_data[key] = JSON.parse(value)
    })
    photos_data.path_arr = files.map((f) => f.path)
    return this.photosService.create(data)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated photos.',
  })
  @ApiConsumes('multipart/form-data')
  //   @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdatePhotosDto,
    @UploadedFiles(new ParseFilePipe({ validators: [] }))
    files: Array<Express.Multer.File>,
  ) {
    const photos_data: Partial<Photos> = {}
    Object.entries(data).forEach(([key, value]) => {
      photos_data[key] = JSON.parse(value)
    })
    if (data.files) photos_data.path_arr = files.map((f) => f.path)
    return this.photosService.update(id, data)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully deleted collection.',
  })
  async delete(@Param('id') id: string) {
    return this.photosService.delete(id)
  }
}
