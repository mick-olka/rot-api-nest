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

const a = {
  Ё: 'YO',
  Й: 'I',
  Ц: 'TS',
  У: 'U',
  К: 'K',
  Е: 'E',
  Н: 'N',
  Г: 'G',
  Ш: 'SH',
  Щ: 'SCH',
  З: 'Z',
  Х: 'H',
  Ъ: 'j',
  ё: 'yo',
  й: 'i',
  ц: 'ts',
  у: 'u',
  к: 'k',
  е: 'e',
  н: 'n',
  г: 'g',
  ш: 'sh',
  щ: 'sch',
  з: 'z',
  х: 'h',
  ъ: "'",
  Ф: 'F',
  Ы: 'I',
  В: 'V',
  А: 'А',
  П: 'P',
  Р: 'R',
  О: 'O',
  Л: 'L',
  Д: 'D',
  Ж: 'ZH',
  Э: 'E',
  ф: 'f',
  ы: 'y',
  і: 'i',
  в: 'v',
  а: 'a',
  п: 'p',
  р: 'r',
  о: 'o',
  л: 'l',
  д: 'd',
  ж: 'zh',
  э: 'e',
  Я: 'Ya',
  Ч: 'CH',
  С: 'S',
  М: 'M',
  И: 'I',
  Т: 'T',
  Ь: '',
  Б: 'B',
  Ю: 'YU',
  я: 'ya',
  ч: 'ch',
  с: 's',
  м: 'm',
  и: 'y',
  т: 't',
  ь: '',
  б: 'b',
  ю: 'yu',
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
