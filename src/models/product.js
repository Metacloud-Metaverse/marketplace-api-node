'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    creator_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      }
    },
    collection_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    parent_product_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      }
    },
    rarity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      }
    },
    gender: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    price: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    stock_available: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    is_bid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_on_sale: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_state_use: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('now')
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('now')
    },
  }, {
    sequelize,
    modelName: 'Product',
    timestamps: false
  });
  return Product;
};