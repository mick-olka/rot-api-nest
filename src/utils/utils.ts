import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import jimp from 'jimp'
import { isValidObjectId } from 'mongoose'

export const getRandomFileName = () => {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '')
  const random = ('' + Math.random()).substring(2, 8)
  const random_number = timestamp + random
  return random_number
}

export const parseFormDataToJSON = (data: any): any => {
  const res = {}
  Object.entries(data).forEach(([key, value]) => {
    if (value) res[key] = value
  })
  return res
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

export const getUrlNameFilter = (id: string): any => {
  if (isValidObjectId(id)) {
    return { _id: id }
  }
  return { url_name: id }
}

const a = {
  ??: 'YO',
  ??: 'I',
  ??: 'TS',
  ??: 'U',
  ??: 'K',
  ??: 'E',
  ??: 'N',
  ??: 'G',
  ??: 'SH',
  ??: 'SCH',
  ??: 'Z',
  ??: 'H',
  ??: 'j',
  ??: 'yo',
  ??: 'i',
  ??: 'ts',
  ??: 'u',
  ??: 'k',
  ??: 'e',
  ??: 'n',
  ??: 'g',
  ??: 'sh',
  ??: 'sch',
  ??: 'z',
  ??: 'h',
  ??: "'",
  ??: 'F',
  ??: 'I',
  ??: 'V',
  ??: '??',
  ??: 'P',
  ??: 'R',
  ??: 'O',
  ??: 'L',
  ??: 'D',
  ??: 'ZH',
  ??: 'E',
  ??: 'f',
  ??: 'y',
  ??: 'i',
  ??: 'v',
  ??: 'a',
  ??: 'p',
  ??: 'r',
  ??: 'o',
  ??: 'l',
  ??: 'd',
  ??: 'zh',
  ??: 'e',
  ??: 'Ya',
  ??: 'CH',
  ??: 'S',
  ??: 'M',
  ??: 'I',
  ??: 'T',
  ??: '',
  ??: 'B',
  ??: 'YU',
  ??: 'ya',
  ??: 'ch',
  ??: 's',
  ??: 'm',
  ??: 'y',
  ??: 't',
  ??: '',
  ??: 'b',
  ??: 'yu',
  "'": 'j',
  '`': 'j',
}

export const transliterate = (word: string): string => {
  return word
    .split('')
    .map((char) => {
      return a[char] || char
    })
    .join('')
}
