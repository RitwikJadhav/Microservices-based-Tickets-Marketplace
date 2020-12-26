import express, { Request, Response } from "express";
import { NotAuthorized, NotFoundError, requireAuth } from "@tixpal/common";
import { Order } from "../models/orders";
import { body } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  [
    body("orderId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input)),
  ],
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorized();
    }
    res.send(order);
  }
);

export { router as ShowOrderRouter };
