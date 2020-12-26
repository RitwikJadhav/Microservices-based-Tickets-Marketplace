import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/orders";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if the ticket does not exist", async () => {
  const ticketId = mongoose.Types.ObjectId();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({ ticketId })
    .expect(404);
});

it("returns an error if the ticket already exists", async () => {
  const ticket = Ticket.build({
    id: "wefwef",
    title: "concert",
    price: 30,
  });
  await ticket.save();
  const order = Order.build({
    ticket,
    userId: "ergeg",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    id: "gwwrf",
    title: "concert",
    price: 30,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("emits an event for order created", async () => {
  const ticket = Ticket.build({
    id: "sefwf",
    title: "concert",
    price: 30,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
