import { Photos } from 'src/schemas/photos.schema'
import { Product } from 'src/schemas/product.schema'

export class ProductDeletedEvent {
  id: string
  data: Product

  constructor(id: string, data: Product) {
    this.id = id
    this.data = data
  }
}

export class ProductImportedEvent {
  id: string
  data: Photos[]

  constructor(id: string, data: Photos[]) {
    this.id = id
    this.data = data
  }
}
