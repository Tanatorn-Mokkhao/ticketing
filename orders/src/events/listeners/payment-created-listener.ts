import { Message } from 'node-nats-streaming'
import { Subjects, Listener, PaymentCreatedEvnet, OrderStatus } from '@marttickets/common'
import { queueGroupName } from './queue-group-name'
import { Order } from '../../models/order'


export class PaymentCreatedListner extends Listener<PaymentCreatedEvnet> { 
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
    queueGroupName = queueGroupName

    async onMessage(data: PaymentCreatedEvnet['data'], msg: Message){ 
        const order = await Order.findById(data.orderId)

        if (!order) {
            throw new Error('Order not found')
        }

        order.set({status: OrderStatus.Complete})
        
        await order.save()

        msg.ack()
    }
}