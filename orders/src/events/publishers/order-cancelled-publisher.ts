import { Publisher, OrderCancelledEvent, Subjects } from "@tixpal/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
