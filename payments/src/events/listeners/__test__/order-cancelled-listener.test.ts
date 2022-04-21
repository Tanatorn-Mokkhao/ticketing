import { OrderCancelledListener } from '../order-cancelled-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledEvent, OrderStatus } from '@marttickets/common'
import { Order } from '../../../models/order'
import mongoose from 'mongoose'

const setup = async () => { 
    const listener = new OrderCancelledListener(natsWrapper.client)

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10,
        userId: 'asdas',
        version: 0
    })
    await order.save()

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1, // pretend like main orderserive is aleady update 1 version because this is not main order service *** important!!!
        ticket: {
            id: 'asdasdas',
        }
    }
    
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, order }
}

it('update status of the order', async () => { 
    const { listener, data, msg, order } = await setup()

    await listener.onMessage(data, msg);

    const updateOrder = await Order.findById(order.id)

    expect(updateOrder!.status).toEqual(OrderStatus.Canclled)

})

it('ack the message', async () => { 
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled()
})