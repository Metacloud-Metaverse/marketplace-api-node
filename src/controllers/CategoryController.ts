const dbs = require('../models/index.js')
const categoryModel = dbs.Category
const apiResponseHandler = require('../helper/ApiResponse.ts')

class CategoryController {

  static async saveCategory(req, res, next) {
    try {
      const data = req.body;
      await categoryModel.create(data, "Category saved successfully");
      apiResponseHandler.send(req, res, "data", data, "Category saved successfully")
      
    } catch (error) {
      next(error);
    }
  }
}
module.exports = CategoryController;