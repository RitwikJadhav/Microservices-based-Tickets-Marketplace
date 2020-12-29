import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorized,
  OrderStatus,
} from "@tixpal/common";
import { Order } from "../models/orders";
import { stripe } from "../stripe";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);
    console.log("Current Order : ", order);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorized();
    }
    if (order.status === OrderStatus.Cancelled) {
      console.log("Catching this error");
      throw new BadRequestError(
        "Order is cancelled and not a valid one. You cannot proceed ahead with payment"
      );
    }
    await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });
    res.send({ success: true });
  }
);

export { router as CreateChargeRouter };
