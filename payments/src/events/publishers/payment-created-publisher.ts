import { Subjects, Publisher, PaymentCreatedEvent } from "@tixpal/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
