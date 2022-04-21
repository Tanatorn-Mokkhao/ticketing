import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'
import jwt from 'jsonwebtoken'

declare global {
    var signin: (id?: string) => string[] //super must return array that why declare string[]
}

jest.mock('../nats-wrapper.ts')

process.env.STRIPE_KEY = 'sk_test_51KqUHsHtH5kAwNVy2OOGrhArgGLmBzyKJQRFsvhyM7HPs7JK0Cmw1XcqXHv53vYsr7xCesJxOe1gsbPuUYFEk7C600HlrMrecL';

let mongo: any

beforeAll(async () => { 
    process.env.JWT_KEY = 'asdas'

    mongo = new MongoMemoryServer()
    await mongo.start();
    const mongoUri = await mongo.getUri()

    await mongoose.connect(mongoUri)
})

beforeEach(async () => { 
    jest.clearAllMocks()
    const collections = await mongoose.connection.db.collections()

    for (let collection of collections) { 
        await collection.deleteMany({})
    }
})

afterAll(async () => { 
    await mongo.stop()
    await mongoose.connection.close()
})

global.signin = (id?: string) => { 
    // Build a jwt payload. {id, email}
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }

    // Create the jwt!
    const token = jwt.sign(payload, process.env.JWT_KEY!)

    //Build session object. {jwt: MY_JWT}
    const session =  {jwt: token }

    //Turn tat session into Json
    const sessionJSON = JSON.stringify(session)

    //Take Json and encode it as nase64
    const base64 = Buffer.from(sessionJSON).toString('base64')


    //return a string thats the cookie with the encoded data
    return [`session=${base64}`]
}