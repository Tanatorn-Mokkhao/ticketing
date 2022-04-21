import { Listener, OrderCancelledEvent, Subjects, OrderStatus } from '@marttickets/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> { 
    subject: Subjects.OrderCanclled = Subjects.OrderCanclled
    queueGroupName = queueGroupName


    async onMessage(data: OrderCancelledEvent['data'], msg: Message) { 
        const order = await Order.findOne({
            _id: data.id,
            // maybe chance update order
           version: data.version - 1 
        })

        if (!order) { 
            throw new Error('Order not found')
        }
        order.set({ status: OrderStatus.Canclled })
        await order.save()
        
        msg.ack()
    }
}