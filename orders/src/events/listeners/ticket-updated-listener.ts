import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  TicketUpdatedEvent,
  NotFoundError,
} from "@tixpal/common";
import { Ticket } from "../../models/ticket";
import { queueuGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueuGroupName;
  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();
    msg.ack();
  }
}
