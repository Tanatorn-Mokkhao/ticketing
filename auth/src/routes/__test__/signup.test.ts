import request from "supertest"
import { app } from '../../app'

it('return a 201 on successful signup', async () => { 
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'mart@test.com',
            password: 'password'
        })
        .expect(201)
})

it('retrun a 400 with an invalid email', async () => { 
    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'asdasd',
        password: 'password'
    })
    .expect(400)
})

it('retrun a 400 with an invalid password', async () => { 
    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'mart@test.com',
        password: 'a'
    })
    .expect(400)
})

it('retrun a 400 with with missing email and password', async () => { 
    await request(app)
    .post('/api/users/signup')
    .send({email: 'mart@test.com'})
    .expect(400)
    
    await request(app)
    .post('/api/users/signup')
    .send({password: 'asdasdas'})
    .expect(400)
})

it('disallows duplicate emails', async () => { 
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'mart@test.com',
        password: 'password'
    })
    .expect(201)
    
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'mart@test.com',
        password: 'password'
    })
    .expect(400)
})

it('sets a cookie after successful signup', async () => { 
    const response = await request(app)
    .post('/api/users/signup')
    .send({
        email: 'mart@test.com',
        password: 'password'
    })
        .expect(201)
    
    expect(response.get('Set-Cookie')).toBeDefined()
})