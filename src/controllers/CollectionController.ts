const dbs = require('../models/index.js');
const collectionModel = dbs.Collection;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const apiResponseHandler = require('../helper/ApiResponse.ts');

class CollectionController {
  static async saveCollection(req, res, next) {
    try {
      const data = req.body
      data.creator_user_id = req.user.user_id
      data.status = 0
      if (data.title == null || data.title == "") {
        const message = "Title can not be Empty or Null"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else {
        await collectionModel.create(data, "Collection saved successfully");
        apiResponseHandler.send(req, res, "data", data, "Collection saved successfully")
      }
    } catch (error) {
      const message = "Error saving collections, Please try again with correct data"
      apiResponseHandler.sendError(req, res, "data", null, message)
    }
  }
}

module.exports = CollectionController;