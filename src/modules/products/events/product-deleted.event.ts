import { Product } from 'src/schemas/product.schema'

export class ProductDeletedEvent {
  id: string
  product: Product

  constructor(id: string, product: Product) {
    this.id = String(id)
    this.product = product
  }
}
