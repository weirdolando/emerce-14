const router = require("express").Router()
const { productController } = require("../controllers")

router.get("/", productController.getProduct)
router.get("/total", productController.getTotalProduct)
router.get("/category", productController.getCategory)
router.get("/:id", productController.getProductDetail)

router.post("/", productController.addProduct)
router.post("/category", productController.addCategory)

router.patch("/:id", productController.editProduct)

router.delete("/:id", productController.deactivateProduct)

module.exports = router