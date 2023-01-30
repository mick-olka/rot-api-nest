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
  Res,
} from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreatePhotoMultipartDto } from './dto/create-photos.dto'
import { UpdatePhotoMultipartDto } from './dto/update-photos.dto'
import { PhotosService } from './photos.service'
import { Photos } from 'src/schemas/photos.schema'
import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { Response } from 'express'
import { extname } from 'path'

function getRandomFileName() {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '')
  const random = ('' + Math.random()).substring(2, 8)
  const random_number = timestamp + random
  return random_number
}

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

  // http://localhost:4000/photos/file/20230130T140642201Z443397.png
  @Get('file/:fileId')
  @HttpCode(HttpStatus.OK)
  async serveAvatar(
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ): Promise<any> {
    res.sendFile(fileId, { root: 'upload' })
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created collection.',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: 'upload',
        filename: (req, file, cb) => {
          return cb(null, `${getRandomFileName()}${extname(file.originalname)}`)
        },
      }),
    }),
  )
  //   @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async create(
    @Body() data: CreatePhotoMultipartDto,
    @UploadedFiles(new ParseFilePipe({ validators: [] }))
    files: Array<Express.Multer.File>,
  ) {
    const photos_data = {
      main_color: undefined,
      pill_color: undefined,
      path_arr: [],
    }
    Object.entries(data).forEach(([key, value]) => {
      photos_data[key] = JSON.parse(value)
    })
    photos_data.path_arr = files.map((f) => f.path)
    console.log(photos_data)
    return this.photosService.create(photos_data)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated photos.',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: 'upload',
        filename: (req, file, cb) => {
          return cb(null, `${getRandomFileName()}${extname(file.originalname)}`)
        },
      }),
    }),
  )
  //   @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdatePhotoMultipartDto,
    @UploadedFiles(new ParseFilePipe({ validators: [] }))
    files: Array<Express.Multer.File>,
  ) {
    const photos_data: Photos = undefined
    Object.entries(data).forEach(([key, value]) => {
      photos_data[key] = JSON.parse(value)
    })
    photos_data.path_arr = files.map((f) => f.path)
    return this.photosService.update(id, photos_data)
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
