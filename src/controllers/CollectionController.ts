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
      if (data.title == null || data.title == "" || !(isNaN(data.title))) {
        const message = "Title is required, must be string, and can not be Empty or Null"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else if ((data.status && (isNaN(data.status) || data.status > 1)) || (data.status === null || data.status === "")) {
        const message = "Status value is invalid, It can be either 0 or 1"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else {
        if (!data.status) { data.status = 0 }
        await collectionModel.create(data, "Collection saved successfully");
        apiResponseHandler.send(req, res, "data", data, "Collection saved successfully")
      }
    } catch (error) {
      const message = "Error saving collections, Please try again with correct data"
      apiResponseHandler.sendError(req, res, "data", null, message)
    }
  }
  static async updateCollection(req, res, next) {
    try {
      const data = req.body
      data.creator_user_id = req.user.user_id
      const isCollectionExist = await CollectionController.collectionExist(req.params.id)
      if (!isCollectionExist) {
        const message = "Error updating collections, No collection found with given Id"
        apiResponseHandler.sendError(req, res, "data", null, message)
      } else {
        if (data.title === null || data.title === "" || (data.title && !(isNaN(data.title)))) {
          const message = "Title must be string, and can not be Empty or Null"
          apiResponseHandler.sendError(req, res, "data", null, message)
        } else if (data.status === null || data.status === "" || (data.status && (isNaN(data.status) || data.status > 1))) {
          const message = "Invalid value of status, status can be either 0 or 1"
          apiResponseHandler.sendError(req, res, "data", null, message)
        } else {
          data.updated_at = Sequelize.fn('now')
          await collectionModel.update(data, { where: { id: req.params.id } });
          apiResponseHandler.send(req, res, "data", data, "Collection updated successfully")
        }
      }
    } catch (error) {
      const message = "Error updating collections, Please try again with correct data"
      apiResponseHandler.sendError(req, res, "data", null, message)
    }
  }
  static collectionExist(id) {
    return collectionModel.findOne({ where: { id: id } })
  }

}

module.exports = CollectionController;