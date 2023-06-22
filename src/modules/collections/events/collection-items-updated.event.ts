import { UpdateCollectionItemsDto } from '../dto/update-collection.dto'

export class CollectionItemsUpdatedEvent {
  id: string
  data: UpdateCollectionItemsDto

  constructor(collection_id: string, data: UpdateCollectionItemsDto) {
    this.id = collection_id
    this.data = data
  }
}
