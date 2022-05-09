const dbs = require('../models/index.js');
const productModel = dbs.Product;
const Sequelize = require('sequelize')
const { QueryTypes } = require('sequelize')
const Op = Sequelize.Op;
const apiResponseHandler = require('../helper/ApiResponse.ts');
let isValidate = null;
class ProductController {
  static async saveProduct(req, res, next) {
    try {
      const data = req.body
      data.creator_user_id = req.user.user_id
      if (!data.title) {
        const message = "Title field required is either empty or null";
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (!data.gender) {
        const message = "Gender field required is either empty or null";
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (!data.rarity) {
        const message = "Rarity field required is either empty or null";
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (data.type && data.type > 1) {
        const message = "type value is not valid, Value should be either 0 or 1"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (data.gender && (data.gender > 2)) {
        const message = "gender value is not valid, Value should be either 0, 1 or 2"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (data.rarity && data.rarity > 6) {
        const message = "rarity value is not valid, Value should be between 0 and 6"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (data.is_bid && data.is_bid > 1) {
        const message = "is_bid value is not valid, Value should be either 0 or 1"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (data.is_on_sale && data.is_on_sale > 1) {
        const message = "is_on_sale value is not valid, Value should be either 0 or 1"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (data.is_state_use && data.is_state_use > 1) {
        const message = "is_state_use value is not valid, Value should be either 0 or 1"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (data.title == null || data.title == "") {
        const message = "Title can not be Empty or Null"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if (data.price && !(isValidate = await ProductController.validatePrice(data.price))) {
        const message = "price value is not valid, Value should numbers only"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else {
        await productModel.create(data, "Product saved successfully");
        apiResponseHandler.send(req, res, "data", data, "Product saved successfully")
      }
    } catch (error) {
      const message = "Error saving products, Please try again with correct data"
      apiResponseHandler.sendError(req, res, "data", null, message)
    }
  }
  static async getProductById(req, res, next) {
    try {
      const product_id = req.params.id
      let isProductExist = await ProductController.productExist(product_id)
      if (!isProductExist) {
        const message = "Product not available with given id";
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
      const whereCondition = {};
      let sortByCondition = ["id"];
      if (data.title) { whereCondition['title'] = { [Op.like]: '%' + data.title + '%' } }
      if (data.onlyOnSale) { whereCondition['is_on_sale'] = data.onlyOnSale }
      if (data.collectionId) { whereCondition['collection_id'] = data.collectionId }
      if (data.gender) { whereCondition['gender'] = data.gender }
      if (data.categoryId) { whereCondition['category_id'] = data.categoryId }
      if (data.rarities) { 
        let rarityArray = data.rarities.split(',');
        let a = rarityArray.length;
        const array = []
        for (let i = 0; i < a; i++) {
          console.log(rarityArray[i])
          array.push(rarityArray[i])
        }
        whereCondition['rarity'] = { [Op.in]: array } 
      }
      if (data.sortBy) {
        if (data.sortBy == 0) { sortByCondition = ["title"] }
        if (data.sortBy == 1) { sortByCondition = ["created_at", "DESC"] }
        if (data.sortBy == 2) { sortByCondition = ["price", "ASC"] }
      }
      console.log(whereCondition)
      const result = await productModel.findAll({
        where: whereCondition,
        order: [[sortByCondition]]
      },
      );
      if (!result || result.length == 0) {
        const message = "No product matches with given data";
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
    return await data.match(/^\d+(?:[.]\d+)*$/);
  }
}

module.exports = ProductController;