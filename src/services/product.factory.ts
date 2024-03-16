import mongoose, { Document, ObjectId, Schema, Types, UpdateWriteOpResult } from 'mongoose'
import productModel, { IProduct, IProductBook, IProductDoc, IProductFood, productBookModel, productFoodModel } from '~/models/product.model'
import { shopModel } from '~/models/shop.model'
import { shopProductUnique } from '~/utils/shop.utils'

interface IProductStrategy {
      createProduct: () => Promise<
            mongoose.Document<unknown, {}, IProductDoc> &
                  IProduct &
                  mongoose.Document<any, any, any> & {
                        _id: Types.ObjectId
                  }
      >
}

export class ProductFactory {
      static productStrategy: IProductStrategy

      static async createProduct(product: IProductStrategy) {
            ProductFactory.productStrategy = product
            return ProductFactory.productStrategy.createProduct()
      }
}

type TProduct = Omit<Omit<IProduct, 'product_desc_image'>, 'product_thumb_image'>

class Product implements IProductStrategy {
      private _id: Types.ObjectId
      private shop_id: Types.ObjectId
      private product_name: string
      private product_price: number
      protected product_type: string
      private product_is_bought: number
      private product_state: boolean
      private product_available: number
      private product_votes: number
      protected attribute: IProductBook | IProductFood
      constructor({
            shop_id,
            product_name,
            product_price,
            attribute,
            _id,
            product_type,
            product_state,
            product_is_bought,
            product_available,
            product_votes
      }: TProduct & { _id: Types.ObjectId }) {
            this.shop_id = shop_id
            this.product_name = product_name
            this.product_price = product_price
            this.product_type = product_type
            this.attribute = attribute
            this._id = _id
            this.product_state = product_state
            this.product_is_bought = product_is_bought
            this.product_available = product_available
            this.product_votes = product_votes
      }

      async createProduct() {
            console.log({ shop_id: this.shop_id })

            const product = await productModel.findOneAndUpdate(
                  { _id: this._id },
                  {
                        $set: {
                              shop_id: this.shop_id,
                              product_name: this.product_name,
                              product_price: this.product_price,
                              product_is_bought: this.product_is_bought,
                              product_type: this.product_type,
                              attribute: this.attribute,
                              product_state: this.product_state,
                              product_available: this.product_available,
                              product_votes: this.product_votes,

                              isProductFull: true
                        }
                  },
                  { new: true, upsert: true }
            )

            return product
      }
}

type ModeForm = 'UPLOAD' | 'UPDATE'
export class ProductBook extends Product implements IProductStrategy {
      protected attribute: IProductBook
      mode: ModeForm
      constructor({
            _id,
            shop_id,
            product_name,
            product_price,
            product_type = 'Book',
            product_is_bought,
            product_state = true,
            totalComment = 0,
            product_available,
            product_votes,
            attribute,
            mode
      }: TProduct & { _id: Types.ObjectId; mode: ModeForm }) {
            super({
                  _id,
                  shop_id,
                  product_name,
                  product_price,
                  totalComment,
                  product_type,
                  product_is_bought,
                  product_state,
                  product_available,
                  product_votes,
                  attribute
            })
            this.attribute = attribute as IProductBook
            this.mode = mode
      }

      async createProduct() {
            const createProductBook = await productBookModel.create({
                  product_id: this.attribute.product_id,
                  author: this.attribute.author,
                  publishing: this.attribute.publishing,
                  page_number: this.attribute.page_number,
                  description: this.attribute.description,
                  book_type: this.attribute.type
            })

            console.log({ book: createProductBook })
            const createProduct = await super.createProduct()
            console.log('Book')

            if (createProduct) {
                  console.log('system')
                  if (this.mode === 'UPLOAD') {
                        const productShopQuery = { _id: new Types.ObjectId(createProduct.shop_id?._id) }
                        const product = await productModel
                              .findOne({ _id: new Types.ObjectId(createProduct._id) })
                              .populate('shop_id', '_id')
                        // const productShopUpdate = { $push: { shop_products: { product_id: new Types.ObjectId(product_id) } } }
                        // const productShopOptions = { new: true, upsert: true }
                        await shopProductUnique({
                              shop_id: new Types.ObjectId(product?.shop_id._id),
                              product_id: new Types.ObjectId(createProduct._id)
                        })
                  }
            }

            return createProduct
      }
}

export class ProductFood extends Product implements IProductStrategy {
      protected attribute: IProductFood
      mode: ModeForm
      constructor({
            _id,
            shop_id,
            product_name,
            product_price,
            product_type = 'Food',
            product_is_bought,
            product_state = true,
            totalComment = 0,
            product_available,
            product_votes,
            mode,
            attribute
      }: TProduct & { _id: Types.ObjectId; mode: ModeForm }) {
            super({
                  _id,
                  shop_id,
                  product_name,
                  product_price,
                  totalComment,
                  product_is_bought,
                  product_type,
                  product_available,
                  product_state,
                  product_votes,
                  attribute
            })
            this.attribute = attribute as IProductFood
            this.mode = mode
      }

      async createProduct() {
            const createProductFood = await productFoodModel.create({
                  product_id: this.attribute.product_id,
                  product_food_Manufacturers_Name: this.attribute.product_food_Manufacturers_Name,
                  product_food_origin: this.attribute.product_food_origin,
                  product_food_unit: this.attribute.product_food_unit,
                  product_food_Date_Of_manufacture: this.attribute.product_id,

                  description: this.attribute.description,
                  product_food_type: this.attribute.type
            })

            console.log({ food: createProductFood })
            const createProduct = await super.createProduct()
            if (createProduct) {
                  console.log('system')
                  if (this.mode === 'UPLOAD') {
                        const productShopQuery = { _id: new Types.ObjectId(createProduct.shop_id?._id) }
                        const product = await productModel
                              .findOne({ _id: new Types.ObjectId(createProduct._id) })
                              .populate('shop_id', '_id')
                        // const productShopUpdate = { $push: { shop_products: { product_id: new Types.ObjectId(product_id) } } }
                        // const productShopOptions = { new: true, upsert: true }
                        await shopProductUnique({
                              shop_id: new Types.ObjectId(product?.shop_id._id),
                              product_id: new Types.ObjectId(createProduct._id)
                        })
                  }
            }
            return createProduct
      }
}
