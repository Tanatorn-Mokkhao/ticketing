import { Publisher, TicketUpdatedEvent, Subjects } from '@marttickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> { 
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}