import { Photos } from 'src/schemas/photos.schema'

export class PhotosDeletedEvent {
  id: string
  product_id: string
  data: Photos

  constructor(id: string, product_id: string, data: Photos) {
    this.id = id
    this.product_id = product_id
    this.data = data
  }
}
