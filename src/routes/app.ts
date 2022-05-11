const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth.ts");
const categoryController = require("../controllers/CategoryController.ts");
const collectionController = require("../controllers/CollectionController.ts");
const productController = require("../controllers/ProductController.ts");

router.post('/category/save', categoryController.saveCategory)
router.get('/categories/list-with-tree', categoryController.getCategories)
router.post('/collection/save', auth, collectionController.saveCollection)
router.post('/collection/save/:id', auth, collectionController.updateCollection)
router.post('/product/save', auth, productController.saveProduct)
router.post('/product/save/:id', productController.updateProduct)
router.get('/product/fetch/:id', productController.getProductById)
router.get('/product/search', productController.searchProduct)

module.exports = router;
