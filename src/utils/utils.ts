import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'

export const getRandomFileName = () => {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '')
  const random = ('' + Math.random()).substring(2, 8)
  const random_number = timestamp + random
  return random_number
}

export const filesInterceptor = FilesInterceptor('files', 20, {
  storage: diskStorage({
    destination: 'upload',
    filename: (req, file, cb) => {
      return cb(null, `${getRandomFileName()}${extname(file.originalname)}`)
    },
  }),
})
