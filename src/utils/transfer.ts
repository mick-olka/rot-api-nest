import { join } from 'path'
import { promises as fs } from 'fs'

import { lanEnumToObject } from 'src/schemas/data'
import { Photos } from 'src/schemas/photos.schema'
import { Product } from 'src/schemas/product.schema'

interface OldProductI {
  _id: {
    $oid: string
  }
  keywords: string[]
  relatedProducts: string[]
  similarProducts: string[]
  types: object[]
  name: {
    ua: string
    ru: string
  }
  url_name: string
  price: number
  oldPrice: number
  code: string
  features: {
    ua: {
      key: string
      value: string
    }[]
    ru: {
      key: string
      value: string
    }[]
  }
  description: {
    ua: string
    ru: string
  }
  index: number
  // just filename
  thumbnail: string
  images: {
    pathArr: (string | 'uploads/filename.jpg')[]
    mainColor: {
      ua: string
      ru: string
    }
    pillColor: {
      ua: string
      ru: string
    }
    _id: {
      $oid: string
    }
  }[]
}

export const performTransfer = async () => {
  //
}

export const getProductsJSON = async (): Promise<OldProductI[]> => {
  try {
    const jsonDirectory = join(process.cwd(), 'src', 'utils')
    const fileContents = await fs.readFile(
      jsonDirectory + '/products.json',
      'utf8',
    )
    return JSON.parse(fileContents).products
  } catch (err) {
    console.log(err)
  }
}

export const transferOneProduct = (
  old: OldProductI,
): { product: Product; photos: Photos[] } => {
  const new_prod: Product = {
    name: lanEnumToObject(old.name.ua),
    code: old.code,
    index: old.index,
    price: old.price,
    old_price: old.oldPrice,
    collections: [],
    description: lanEnumToObject(old.description.ua),
    features: lanEnumToObject(
      old.features.ua.map((f) => ({ key: f.key, value: f.value })),
    ),
    keywords: old.keywords,
    photos: [],
    related_products: [],
    similar_products: [],
    thumbnail: old.thumbnail,
    url_name: old.url_name,
    active: true,
  }
  const photos: Photos[] = old.images.map((p) => ({
    path_arr: p.pathArr.map((p) => p.split('/').pop()),
    main_color: lanEnumToObject(p.mainColor.ua),
    pill_color: lanEnumToObject(p.pillColor.ua),
  }))
  return { product: new_prod, photos: photos }
}
