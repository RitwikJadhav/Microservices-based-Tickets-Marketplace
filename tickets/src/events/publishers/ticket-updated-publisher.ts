import { Publisher, Subjects, TicketUpdatedEvent } from "@tixpal/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
