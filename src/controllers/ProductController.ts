const dbs = require('../models/index.js')
const productModel = dbs.Product
const catgoryModel = dbs.Category
const collectionModel = dbs.Collection
const controllerModel = dbs.Controller
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const apiResponseHandler = require('../helper/ApiResponse.ts')

let isValidate = null
const stockAvailable = {
  0: 1,
  1: 10,
  2: 100,
  3: 1000,
  4: 5000,
  5: 10000,
  6: 100000,
}

class ProductController {
  static async saveProduct(req, res, next) {
    try {
      const data = req.body
      data.creator_user_id = req.user.user_id
      if (await ProductController.checkRequired(req, res, data) && await ProductController.checkValidation(req, res, data)) {
        if (data.collection_id && !(await ProductController.collectionExist(data.collection_id))) {
          const message = "Error saving products, collection does not exist with given collection_id"
          apiResponseHandler.sendError(req, res, "data", null, message)
        } else if (data.category_id && !(await ProductController.categoryExist(data.category_id))) {
          const message = "Error saving products, category does not exist with given category_id"
          apiResponseHandler.sendError(req, res, "data", null, message)
        } else if (data.parent_product_id && !(await ProductController.productExist(data.parent_product_id))) {
          const message = "Error saving products, product does not exist with given category_id"
          apiResponseHandler.sendError(req, res, "data", null, message)
        } else {
          data.stock_available = stockAvailable[data.rarity]
          console.log(data)
          await productModel.create(data, "Product saved successfully")
          apiResponseHandler.send(req, res, "data", data, "Product saved successfully")
        }
      }
    } catch (error) {
      const message = "Error saving products, Please try again with correct data"
      apiResponseHandler.sendError(req, res, "data", null, message)
    }
  }
  static async updateProduct(req, res, next) {
    try {
      const data = req.body
      const isProductExist = await ProductController.productExist(req.params.id)
      if (!isProductExist) {
        const message = "Error updating product, No product found with given Id"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else {
        if (await ProductController.checkValidation(req, res, data)) {
          if (data.collection_id && !(await ProductController.collectionExist(data.collection_id))) {
            const message = "Error saving products, collection does not exist with given collection_id"
            apiResponseHandler.sendError(req, res, "data", null, message)
          } else if (data.category_id && !(await ProductController.categoryExist(data.category_id))) {
            const message = "Error saving products, category does not exist with given category_id"
            apiResponseHandler.sendError(req, res, "data", null, message)
          } else if (data.parent_product_id && !(await ProductController.productExist(data.parent_product_id))) {
            const message = "Error saving products, product does not exist with given category_id"
            apiResponseHandler.sendError(req, res, "data", null, message)
          } else {
            if (data.rarity) {
              data.stock_available = stockAvailable[data.rarity]
            }
            data.updated_at = Sequelize.fn('now')
            await productModel.update(data, { where: { id: req.params.id } })
            const result = await ProductController.productExist(req.params.id)
            apiResponseHandler.send(req, res, "data", result, "Product updated successfully")
          }
        }
      }
    } catch (error) {
      const message = "Error updating products, Please try again with correct data"
      apiResponseHandler.sendError(req, res, "data", null, message)
    }
  }
  static async getProductById(req, res, next) {
    try {
      const product_id = req.params.id
      let isProductExist = await ProductController.productExist(product_id)
      if (!isProductExist) {
        const message = "Product not available with given id"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else {
        const data = isProductExist
        apiResponseHandler.send(req, res, "data", data, "Product fetched successfully")
      }
    } catch (error) {
      const message = "Error fetching product, Please try again with correct data"
      apiResponseHandler.sendError(req, res, "data", null, message)
    }
  }
  static async searchProduct(req, res, next) {
    try {
      const data = req.query
      const whereCondition = {}
      let sortByCondition = ["id"]
      if (data.title) {
        if (isNaN(data.title)) {
          whereCondition['title'] = { [Op.like]: '%' + data.title + '%' }
        }
      }
      if (data.onlyOnSale) {
        if (!isNaN(data.onlyOnSale) && (data.onlyOnSale < 2)) {
          whereCondition['is_on_sale'] = data.onlyOnSale
        } else {
          const para = 'onlyOnSale'
          ProductController.validateError(req, res, para)
          return
        }
      }
      if (data.collectionId) {
        if (!isNaN(data.collectionId)) {
          whereCondition['collection_id'] = data.collectionId
        } else {
          const para = 'collection_id'
          ProductController.validateError(req, res, para)
          return
        }
      }
      if (data.gender) {
        if (!isNaN(data.gender) && (data.gender < 3)) {
          whereCondition['gender'] = data.gender
        } else {
          const para = 'gender'
          ProductController.validateError(req, res, para)
          return
        }
      }
      if (data.categoryId) {
        if (!isNaN(data.categoryId)) {
          whereCondition['category_id'] = data.categoryId
        } else {
          const para = 'categoryId'
          ProductController.validateError(req, res, para)
          return
        }
      }
      if (data.userId) {
        if (!isNaN(data.userId)) {
          whereCondition['creator_user_id'] = data.userId
        } else {
          const para = 'userId'
          ProductController.validateError(req, res, para)
          return
        }
      }
      if (data.rarities) {
        let rarityArray = data.rarities.split(',')
        let a = rarityArray.length
        const array = []
        for (let i = 0; i < a; i++) {
          if (!isNaN(rarityArray[i]) && (rarityArray[i] < 7)) {
            array.push(rarityArray[i])
          } else {
            const para = 'rarities'
            ProductController.validateError(req, res, para)
            return
          }
        }
        whereCondition['rarity'] = { [Op.in]: array }
      }
      if (data.sortBy) {
        if (!isNaN(data.sortBy) && (data.sortBy < 3)) {
          if (data.sortBy == 0) { sortByCondition = ["title"] }
          if (data.sortBy == 1) { sortByCondition = ["created_at", "DESC"] }
          if (data.sortBy == 2) { sortByCondition = ["price", "ASC"] }
        } else {
          const para = 'sortBy'
          ProductController.validateError(req, res, para)
          return
        }
      }
      const result = await productModel.findAll({
        where: whereCondition,
        order: [[sortByCondition]]
      },
      )
      if (!result || result.length == 0) {
        const message = "No product matches with given data"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else {
        apiResponseHandler.send(req, res, "data", result, "Product fetched successfully")
      }
    } catch (error) {
      const message = "Error fetching product, Please try again with correct data"
      apiResponseHandler.sendError(req, res, "data", null, message)
    }
  }
  static async productExist(id) {
    return productModel.findOne({ where: { id: id } })
  }
  static async validatePrice(data) {
    return await data.match(/^\d+(?:[.]\d+)*$/)
  }
  static async validateError(req, res, para) {
    const message = `Data of ${para} is not valid, please use valid data`
    apiResponseHandler.sendError(req, res, "data", null, message)
    return
  }
  static async checkValidation(req, res, data) {
    if (data.type === null || data.type === "" || (data.type && (data.type > 1 || isNaN(data.type)))) {
      const message = "type value is not valid, Value should be either 0 or 1"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.gender === null || data.gender === "" || (data.gender && (data.gender > 2 || isNaN(data.gender)))) {
      const message = "gender value is not valid, Value should be either 0, 1 or 2"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.rarity === null || data.rarity === "" || (data.rarity && (data.rarity > 6 || isNaN(data.rarity)))) {
      const message = "rarity value is not valid, Value should be between 0 and 6"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.parent_product_id === "" || (data.parent_product_id && isNaN(data.parent_product_id))) {
      const message = "parent_product_id value is not valid, Value should be integer, and not empty null"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.collection_id === null || data.collection_id === "" || (data.collection_id && isNaN(data.collection_id))) {
      const message = "collection_id value is not valid, Value should be integer, and not empty null"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.category_id === null || data.category_id === "" || (data.category_id && isNaN(data.category_id))) {
      const message = "category_id value is not valid, Value should be integer, and not empty null"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.is_bid === null || data.is_bid === "" || (data.is_bid && (data.is_bid > 1 || isNaN(data.is_bid)))) {
      const message = "is_bid value is not valid, Value should be either 0 or 1"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.is_on_sale === null || data.is_on_sale === "" || (data.is_on_sale && (data.is_on_sale > 1 || isNaN(data.is_on_sale)))) {
      const message = "is_on_sale value is not valid, Value should be either 0 or 1"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.is_state_use === null || data.is_state_use === "" || (data.is_state_use && (data.is_state_use > 1 || isNaN(data.is_state_use)))) {
      const message = "is_state_use value is not valid, Value should be either 0 or 1"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.title === null || data.title === "" || (data.title && !isNaN(data.title))) {
      const message = "Title value is not valid, Value should be string"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.price === null || data.price === "" || (data.price && !(isValidate = await ProductController.validatePrice(data.price)))) {
      const message = "price value is not valid, Value should numbers only"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else {
      return true
    }

  }
  static async checkRequired(req, res, data) {
    if (!data.title) {
      const message = "Title field required is either empty or null"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (!data.gender && data.gender != 0) {
      const message = "Gender field required is either empty or null"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (!data.rarity && data.rarity != 0) {
      const message = "Rarity field required is either empty or null"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (!data.price) {
      const message = "Price field required is either empty or null"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else {
      return true
    }

  }
  static collectionExist(id) {
    return collectionModel.findOne({ where: { id: id } })
  }
  static categoryExist(id) {
    return collectionModel.findOne({ where: { id: id } })
  }
}

module.exports = ProductController