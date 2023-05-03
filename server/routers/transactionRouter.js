const router = require("express").Router();
const { transactionController } = require("../controllers");

router.post("/", transactionController.addTransactions);

module.exports = router;
