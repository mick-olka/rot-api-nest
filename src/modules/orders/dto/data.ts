import { raw } from '@nestjs/mongoose'
import { I_OrderItem } from 'src/schemas/data'

export const orderItem = raw([
  {
    product: { type: String, default: 'product_id' },
    count: { type: String, default: 1 },
    main_color: { type: String, default: '' },
    pill_color: { type: String, default: '' },
  },
])

export const default_cart_item: I_OrderItem = {
  count: 1,
  product: 'product_id',
  main_color: 'white',
  pill_color: 'cream',
}
