import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/orders";
import { OrderStatus } from "@tixpal/common";

it("Returns a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup())
    .send({
      token: "sdvsgvsd",
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("Return a 401 when the order does not belong to the current user", async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: "Advseve",
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup())
    .send({
      token: "sdvsgvsd",
      orderId: order.id,
    })
    .expect(401);
});

it("return 400 when purchasing a cancelled order", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup(userId))
    .send({
      token: "sdvsgvsd",
      orderId: order.id,
    })
    .expect(400);
});
