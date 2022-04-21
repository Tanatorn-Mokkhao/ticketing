import request from "supertest"
import { app } from '../../app'

it('respods wuth details about current user', async () => { 
    const cookie = await global.signin()
    
    const response =  await request(app)
        .get('/api/users/currentUser')
        .set('Cookie', cookie)
        .send()
        .expect(400)
    
        expect(response.body.currentUser.email).toEqual('test@test.com')
})

it('resonse with null if not auth', async () => { 
    const response = await request(app)
        .get('/api/users/currentUser')
        .send()
        .expect(200)
    
    expect(response.body.currentUser).toEqual(null)
})