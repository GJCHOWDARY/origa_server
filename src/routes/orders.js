const express = require("express"),
      OrderController = require("../controllers/orders");

const router = express.Router();

router.get("/getorders", OrderController.getOrders);

router.get("/:id", OrderController.getOrderById);

router.put("/:id", OrderController.updateOrder);

router.post("/createorder", OrderController.createOrder);

router.delete("/:id", OrderController.deleteOrder);

module.exports = router;
