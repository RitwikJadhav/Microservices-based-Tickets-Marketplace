import { Publisher, OrderCreatedEvent, Subjects } from "@tixpal/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
