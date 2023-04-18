const router = require("express").Router()
const { productController } = require("../controllers")

router.get("/", productController.getProduct)
router.get("/total", productController.getTotalProduct)
router.get("/:id", productController.getProductDetail)

router.post("/", productController.addProduct)

router.patch("/:id", productController.editProduct)

router.delete("/:id", productController.deactivateProduct)

module.exports = router