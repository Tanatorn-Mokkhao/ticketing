import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose'
import { natsWrapper } from '../../nats-wrapper'
import { Ticket } from '../../models/ticket'

it('returns a 404 if the proviceed id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'sadsa',
            price: 20
        })
        .expect(404)
})

it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'sadsa',
            price: 20
        })
        .expect(401)
})

it('returns a 401 if the user does not own ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'cascasd',
            price: 20
        })
    
        await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'czxcasd',
            price: 40
        })
        .expect(401)
    
})  

it('returns a 400 if the user providers an invalod title or price', async () => {
    const cookie = global.signin()
    
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'cascasd',
        price: 20
    })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 20
        })
        .expect(400)
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'asdsa',
            price: -10
        })
        .expect(400)
        
})

it('updates the ticker provided an title and price', async () => {
    const cookie = global.signin()
    
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'cascasd',
        price: 20
    })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 100
        })  
        .expect(200)
    
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
    
    expect(ticketResponse.body.title).toEqual('new title')
    expect(ticketResponse.body.price).toEqual(100)
})

it('publishers an event', async () => { 
    const cookie = global.signin()
    
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'cascasd',
        price: 20
    })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 100
        })  
        .expect(200)
    
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('reject updates if the ticket is reserved', async () => { 
    const cookie = global.signin()
    
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'cascasd',
        price: 20
    })

    const ticket = await Ticket.findById(response.body.id)
    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() })
    await ticket!.save()

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 100
        })  
        .expect(400)
})