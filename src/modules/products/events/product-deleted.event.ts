import { Product } from 'src/schemas/product.schema'

export class ProductDeletedEvent {
  id: string
  data: Product

  constructor(id: string, data: Product) {
    this.id = id
    this.data = data
  }
}
