import { Types } from 'mongoose'
import { BadRequestError } from '~/Core/response.error'
import { CartProductWithId } from '~/models/cart.modal'
import productModel from '~/models/product.model'

export const checkQuanity = async ({ products }: { products: CartProductWithId[] }) => {
      const check = await Promise.all(
            products.map(async (product) => {
                  const checkProducts = await productModel.findOne({ _id: new Types.ObjectId(product.product_id._id) })
                  console.log({ product: product.quantity, origin: checkProducts?.product_available })
                  if (checkProducts!.product_available < Number(product.quantity)) {
                        console.log({ error: 'sds' })

                        throw new BadRequestError({
                              detail: `Sản phẩm ${checkProducts?.product_name} có lượng mua nhiều hơn lượng sản phẩm trong kho`
                        })
                  }
            })
      )

      return check
}
