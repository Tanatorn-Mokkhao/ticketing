import express, { Request, Response } from 'express'
import { Ticket } from '../models/ticket'

const router = express.Router()

router.get('/api/tickets', async (req: Request, res: Response) => { 
    const tickers = await Ticket.find({})

    res.send(tickers)
})

export {  router as indexTicketRouter }