import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorized,
  BadRequestError,
} from "@tixpal/common";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { body } from "express-validator";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  async (req: Request, res: Response) => {
    const response = await Ticket.findById(req.params.id);
    if (!response) {
      throw new NotFoundError();
    }

    if (response.orderId) {
      throw new BadRequestError("Cannot update a reserved ticket");
    }

    if (response.userId != req.currentUser!.id) {
      throw new NotAuthorized();
    }

    response.set({
      title: req.body.title,
      price: req.body.price,
    });

    await response.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: response.id!,
      title: response.title,
      price: response.price,
      userId: response.userId,
      version: response.version,
    });
    res.send(response);
  }
);

export { router as UpdateTicketsRouter };
