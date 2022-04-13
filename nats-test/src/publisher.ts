import nats, { Stan } from 'node-nats-streaming'
import { TickerCreatedPublisher } from './events/ticket-created-publisher'

// console.clear();


const client = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
})


client.on('connect', () => { 
    console.log('Publisher connected to NATS')

    const publisher = new TickerCreatedPublisher(client)
    publisher.publish({
        id: '123',
        title: 'concert',
        price: 20
    })

    // const data = JSON.stringify({
    //     id: '123',
    //     title: 'concert',
    //     price: 20
    // })

    // client.publish('ticket:created', data, () => { 
    //     console.log('Event published')
    // })
})