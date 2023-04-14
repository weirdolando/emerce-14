const userRouter = require("express").Router();
const { userController } = require("../controllers");

userRouter.post("/register", userController.register);

module.exports = userRouter;
