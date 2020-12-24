import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorized,
} from "@tixpal/common";
import { body } from "express-validator";

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

    if (response.userId != req.currentUser!.id) {
      throw new NotAuthorized();
    }

    response.set({
      title: req.body.title,
      price: req.body.price,
    });

    await response.save();
    res.send(response);
  }
);

export { router as UpdateTicketsRouter };
