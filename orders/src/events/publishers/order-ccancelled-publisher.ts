import { Publisher, OrderCancelledEvent, Subjects } from '@marttickets/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> { 
    subject: Subjects.OrderCanclled = Subjects.OrderCanclled
}
