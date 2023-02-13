import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import jimp from 'jimp'

export const getRandomFileName = () => {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '')
  const random = ('' + Math.random()).substring(2, 8)
  const random_number = timestamp + random
  return random_number
}

export const photosInterceptor = FilesInterceptor('files', 20, {
  storage: diskStorage({
    destination: 'upload',
    filename: (req, file, cb) => {
      return cb(null, `${getRandomFileName()}${extname(file.originalname)}`)
    },
  }),
})

export const thumbnailInterceptor = FileInterceptor('thumbnail', {
  storage: diskStorage({
    destination: 'upload',
    filename: (req, file, cb) => {
      return cb(null, `${getRandomFileName()}${extname(file.originalname)}`)
    },
  }),
})

let watermark
// find watermark
jimp
  .read(join(__dirname, '..', '..', 'resources', 'watermark1.png'))
  .then((image) => {
    watermark = image
  })

export const preparePhotos = (
  files: Array<Express.Multer.File>,
  max_size: number,
) => {
  for (let i = 0; i < files.length; i++) {
    jimp.read(files[i].path, (err, img) => {
      if (err) throw err
      else {
        img
          .scaleToFit(max_size, max_size) // resize
          .quality(72) // set JPEG quality
        const w = img.getWidth(),
          h = img.getHeight()
        watermark.scaleToFit(w - 100, 500)
        img
          .composite(watermark, 50, h / 2 - 145) // set watermark
          .write(files[i].path) // save
      }
    })
  }
}

export const getFilterForSearch = (
  search_string: string | undefined,
  fields: string[],
): any => {
  let filter: any = {}
  if (search_string) {
    const search_words = search_string.split(' ').join('|')
    const regex = new RegExp(search_words, 'i') // i for case insensitive
    const regex_fields = fields.map((f) => ({ [f]: { $regex: regex } }))
    filter = { $or: regex_fields }
  }
  return filter
}
