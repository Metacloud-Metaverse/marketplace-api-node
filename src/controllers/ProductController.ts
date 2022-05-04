const dbs = require('../models/index.js');
const productModel = dbs.Product;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const apiResponseHandler = require('../helper/ApiResponse.ts');
let isValidate = null;
class ProductController {
  static async saveProduct(req, res, next) {
    try {
      const data = req.body
      data.creator_user_id = req.user.user_id
      data.status = 0
      console.log(data)
      if (!data.title || !data.gender || !data.rarity ) {
        const message = "Required field is/are empty or null";
        apiResponseHandler.sendError(req, res, "data", null, message)
     }else if (data.type && data.type > 1) {
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
      } else if (data.price && !(isValidate = await ProductController.validatePrice(data.price))){
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
  static async validatePrice(data) {
    console.log(data)
    return await data.match(/^\d+(?:[.]\d+)*$/);
  }
}

module.exports = ProductController;