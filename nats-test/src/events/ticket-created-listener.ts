import { Listener } from './base-listner'
import { Message } from 'node-nats-streaming'
import { Subjects } from './subject'
import { TicketCreatedEvent } from './ticket-created-event'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> { 
    subject: Subjects.TicketCreated = Subjects.TicketCreated
    queueGroupName = 'payments-service'

    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('Event data!', data)

        msg.ack()
    }
}