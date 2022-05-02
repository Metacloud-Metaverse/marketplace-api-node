const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth.ts");
const categoryController = require("../controllers/CategoryController.ts");
const collectionController = require("../controllers/CollectionController.ts");

router.post('/category/save', categoryController.saveCategory)
router.get('/categories/list-with-tree', categoryController.getCategories)
router.post('/collection/save', auth, collectionController.saveCollection)


module.exports = router;
