import { Publisher, Subjects, TicketCreatedEvent } from "@tixpal/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
