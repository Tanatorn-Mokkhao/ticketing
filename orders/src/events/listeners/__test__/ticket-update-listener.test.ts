import { TicketUpdatedListener } from '../ticket-updated-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { TicketUpdatedEvent } from '@marttickets/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
    //create instand of listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await ticket.save()

    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new concert',
        price: 999,
        userId: 'asdas'
    }
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, ticket, msg }
}

it('finds, updates, and saves a ticket', async () => {
    const { listener, data, ticket, msg } = await setup();

    await listener.onMessage(data, msg)

    const updateTicket = await Ticket.findById(ticket.id)
3
    expect(updateTicket!.title).toEqual(data.title)
    expect(updateTicket!.price).toEqual(data.price)
    expect(updateTicket!.version).toEqual(data.version)
})

it('acks the message', async () => { 
    const { msg, data, listener } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
    
})

it('doesc not call ack if the event has a skipped version number', async () => { 
    const { msg, data, ticket, listener } = await setup()

    data.version = 10;
    try {
        await listener.onMessage(data, msg)
    } catch (err) { 
        
    }
    expect(msg.ack).not.toHaveBeenCalled()
})