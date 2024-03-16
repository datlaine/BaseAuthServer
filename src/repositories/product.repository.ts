import productModel, { ProductType } from '~/models/product.model'

class ProductRepository {
      static async countProductWithType({ product_type }: { product_type: ProductType }) {
            const result = await productModel.aggregate([
                  {
                        $match: { product_type }
                  },
                  {
                        $group: {
                              _id: '$_id',
                              products: { $first: '$$ROOT' },
                              count_type: { $sum: 1 }
                        }
                  }
            ])
            return result
      }

      static async getCategory({ product_type }: { product_type: ProductType }) {
            const result = await productModel.aggregate([
                  {
                        $match: { product_type }
                  },

                  {
                        $project: {
                              category: '$attribute.book_type'
                        }
                  },
                  {
                        $group: {
                              _id: '$_id',
                              products: { $first: '$$ROOT' },
                              count_type: { $sum: 1 }
                        }
                  }
            ])
      }

      static async getProductDetai({ product_type }: { product_type: ProductType }) {
            const result = await productModel.aggregate([
                  {
                        $match: { product_type }
                  },

                  // {
                  //       $project: {
                  //             category: '$attribute.book_type'
                  //       }
                  // },
                  {
                        $group: {
                              _id: '$attribute.book_type',
                              products: { $first: '$$ROOT' },
                              count_type: { $sum: 1 }
                        }
                  }
            ])

            return result
      }
}

export default ProductRepository
