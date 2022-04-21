import { Publisher, Subjects, PaymentCreatedEvnet } from '@marttickets/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvnet>{ 
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}