import express from 'express'
import 'express-async-errors'
import { errorHandler, NotFoundError, currentUser } from '@marttickets/common'
import cookieSession from 'cookie-session'
import { createChargeRouter } from './routes/new'

const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test' // if we are running mpn run test it will defined with test then return false
    })
)

app.use(currentUser);
app.use(createChargeRouter)

app.all('*', () => { 
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }