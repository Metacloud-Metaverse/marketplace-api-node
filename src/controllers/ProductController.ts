const dbs = require('../models/index.js')
const productModel = dbs.Product
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
      } else if (data.type && (data.type > 1 || isNaN(data.type))) {
        const message = "type value is not valid, Value should be either 0 or 1"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (data.gender && (data.gender > 2 || isNaN(data.gender))) {
        const message = "gender value is not valid, Value should be either 0, 1 or 2"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (data.rarity && (data.rarity > 6 || isNaN(data.rarity))) {
        const message = "rarity value is not valid, Value should be between 0 and 6"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (data.is_bid && (data.is_bid > 1 || isNaN(data.is_bid))) {
        const message = "is_bid value is not valid, Value should be either 0 or 1"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (data.is_on_sale && (data.is_on_sale > 1 || isNaN(data.is_on_sale))) {
        const message = "is_on_sale value is not valid, Value should be either 0 or 1"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (data.is_state_use && (data.is_state_use > 1 || isNaN(data.is_state_use))) {
        const message = "is_state_use value is not valid, Value should be either 0 or 1"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (data.title && !isNaN(data.title)) {
        const message = "Title value is not valid, Value should be string"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (data.price && !(isValidate = await ProductController.validatePrice(data.price))) {
        const message = "price value is not valid, Value should numbers only"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else {
        data.stock_available = stockAvailable[data.rarity]
        console.log(data)
        await productModel.create(data, "Product saved successfully")
        apiResponseHandler.send(req, res, "data", data, "Product saved successfully")
      }
    } catch (error) {
      const message = "Error saving products, Please try again with correct data"
      apiResponseHandler.sendError(req, res, "data", null, message)
    }
  }
  static async updateProduct(req, res, next) {
    try {
      console.log(req.body)
      console.log(req.params.id)
      const data = req.body
      if (data.type && (data.type > 1 || isNaN(data.type))) {
        const message = "type value is not valid, Value should be either 0 or 1"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (data.gender && (data.gender > 2 || isNaN(data.gender))) {
        const message = "gender value is not valid, Value should be either 0, 1 or 2"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (data.rarity && (data.rarity > 6 || isNaN(data.rarity))) {
        const message = "rarity value is not valid, Value should be between 0 and 6"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (data.is_bid && (data.is_bid > 1 || isNaN(data.is_bid))) {
        const message = "is_bid value is not valid, Value should be either 0 or 1"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (data.is_on_sale && (data.is_on_sale > 1 || isNaN(data.is_on_sale))) {
        const message = "is_on_sale value is not valid, Value should be either 0 or 1"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (data.is_state_use && (data.is_state_use > 1 || isNaN(data.is_state_use))) {
        const message = "is_state_use value is not valid, Value should be either 0 or 1"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (data.title && !isNaN(data.title)) {
        const message = "Title value is not valid, Value should be string"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (data.price && !(isValidate = await ProductController.validatePrice(data.price))) {
        const message = "price value is not valid, Value should numbers only"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else {
        if (data.rarity){
        data.stock_available = stockAvailable[data.rarity]
        }
        console.log(data)
        data.updated_at = Sequelize.fn('now')
        await productModel.update(data, { where: { id: req.params.id}})
        const result = await ProductController.productExist(req.params.id)
        apiResponseHandler.send(req, res, "data", result, "Product updated successfully")
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
    console.log(id)
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
}

module.exports = ProductController