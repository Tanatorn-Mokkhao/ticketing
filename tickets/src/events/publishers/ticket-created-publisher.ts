import { Publisher, TicketCreatedEvent, Subjects } from '@marttickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> { 
    subject: Subjects.TicketCreated = Subjects.TicketCreated
}