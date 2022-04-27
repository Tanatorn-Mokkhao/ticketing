import express from 'express'
import 'express-async-errors'
import { errorHandler, NotFoundError, currentUser } from '@marttickets/common'
import cookieSession from 'cookie-session'
import { indexOrderRouter } from './routes/index'
import { deleteOrderRouter } from './routes/delete'
import { showOrderRouter } from './routes/show'
import { newOrderRouter } from './routes/new'

const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(
    cookieSession({
        signed: false,
        // secure: process.env.NODE_ENV !== 'test' // if we are running mpn run test it will defined with test then return false
        secure: false
    })
)

app.use(currentUser);

app.use(indexOrderRouter)
app.use(deleteOrderRouter)
app.use(newOrderRouter)
app.use(showOrderRouter)


app.all('*', () => { 
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }