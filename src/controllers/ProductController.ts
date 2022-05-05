const dbs = require('../models/index.js');
const productModel = dbs.Product;
const Sequelize = require('sequelize')
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
  static async searchProduct(req, res, next){
    try {
      const data = req.query
      console.log(data) 
      const result = await productModel.findAll({
        where: {
          title: { [Op.like]: '%' + req.query.title + '%' },
        }
      });
      apiResponseHandler.send(req, res, "data", result, "Product fetched successfully")
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