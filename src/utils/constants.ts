export const constants = {
  ADMIN_KEY: process.env.ADMIN_KEY,
}

export enum EVENTS {
  product_deleted = 'product.deleted',
  photos_deleted = 'photos.deleted',
  photos_added = 'photos.added',
  collection_deleted = 'collection.deleted',
  collection_items_updated = 'collection.items.updated',
  product_import = 'product.import',
}
