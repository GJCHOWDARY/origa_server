const express = require("express"),
      UserController = require("../controllers/user");

const router = express.Router();

router.get("/updateall", UserController.randomUpdateUser);

router.get("/search", UserController.searchUsers);

router.get("/orderdetails", UserController.userAverageOrders);

router.get("/getusers", UserController.getUsers);

router.get("/:id", UserController.getUser);

router.put("/:id", UserController.updateUser);

router.post("/", UserController.createUser);

router.delete("/:id", UserController.deleteUser);

module.exports = router;
