import express from 'express'
import 'express-async-errors'
import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { errorHandler, NotFoundError } from '@marttickets/common'
import cookieSession from 'cookie-session'


const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test' // if we are running mpn run test it will defined with test then return false
    })
)

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', () => { 
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }