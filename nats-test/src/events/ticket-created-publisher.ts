import { Publisher } from './base-publisher'
import { TicketCreatedEvent } from './ticket-created-event'
import { Subjects } from './subject'

export class TickerCreatedPublisher extends Publisher<TicketCreatedEvent> { 
    subject: Subjects.TicketCreated = Subjects.TicketCreated
    
}