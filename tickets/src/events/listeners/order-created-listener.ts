import { Listener, OrderCreatedEvent, Subjects } from '@marttickets/common'
import { Message } from 'node-nats-streaming'
import { queuegroupname } from './queue-group-name'
import { Ticket } from '../../models/ticket'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> { 
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = queuegroupname

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) { 
        // find the ticket the order is reserving
        const ticket = await Ticket.findById(data.ticket.id)
        // if not ticket throw error
        if (!ticket) {
            throw new Error('Ticket not found')
        }
        // mark the ticket as being reserved by setting it orderId proeprty
        ticket.set({orderId: data.id})
        // save the ticket
        await ticket.save()
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        })
        // arc the message
        msg.ack()
    }

}