const dbs = require('../models/index.js');
const categoryModel = dbs.Category;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const apiResponseHandler = require('../helper/ApiResponse.ts');

class CategoryController {
  static async saveCategory(req, res, next) {
    try {
      const data = req.body;
      await categoryModel.create(data, "Category saved successfully");
      apiResponseHandler.send(req, res, "data", data, "Category saved successfully")
    } catch (error) {
      next(error)
    }
  }
  static async getCategories(req, res, next) {
    try {
      const data = req.query
      const result = []
      if (!data.type) {
        const getAllCategories = await CategoryController.getAllCategories()
        for (const category of getAllCategories) {
          const getCategoryChildren = await CategoryController.getCategoryChildren(category.id)
          console.log(getCategoryChildren)
          if (Object.keys(getCategoryChildren).length) {
            category.child = getCategoryChildren
          }
          result.push(category)
        }
      } else {
        const getCategoriesByType = await CategoryController.getCategoriesByType(data.type)
        for (const category of getCategoriesByType) {
          const getCategoryChildren = await CategoryController.getCategoryChildren(category.id)
          if (Object.keys(getCategoryChildren).length) {
            category.child = getCategoryChildren
          }
          result.push(category)
        }
      }
      if (Object.keys(result).length) {
        apiResponseHandler.send(req, res, "data", result, "All Categories fetched successfully")
      } else {
        apiResponseHandler.send(req, res, "data", result, "No data found")
      }
    } catch (error) {
      const message = "Error fetching categories, Please try again with correct data"
      apiResponseHandler.sendError(req, res, "data", null, message)
    }
  }
  static async getAllCategories() {
    return await categoryModel.findAll({ where: { parent_id: null }, raw: true })
  }
  static async getCategoriesByType(type) {
    return await categoryModel.findAll({ where: { [Op.and]: [{ type: type }, { parent_id: null }] }, raw: true })
  }
  static async getCategoryChildren(id) {
    return await categoryModel.findAll({ where: { parent_id: id }, raw: true })
  }
}
module.exports = CategoryController;