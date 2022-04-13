import { Ticket } from '../ticket'

// we cant use done callback when use async
it('implements optimistic concurrency control', async () => { 
    // Create an instand of a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    })

    // save ticket to database
    await ticket.save()

    // fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id)
    const secondInstance = await Ticket.findById(ticket.id)
    // make two seperate change to the tickets we fetched 
    firstInstance!.set({price: 10})
    secondInstance!.set({price: 15})
    // save the first fetched ticket
    await firstInstance!.save()
    // save the second fetched ticket and expect an error

    //if ths acn save must throw error casue we check havedle save incorrect version
    try {
        await secondInstance!.save();
    } catch (err) {
        return
    }
      throw new Error('Should not reach thos point')
})

it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: '123'
    })

    await ticket.save()
    expect(ticket.version).toEqual(0)
    await ticket.save()
    expect(ticket.version).toEqual(1)
    await ticket.save()
    expect(ticket.version).toEqual(2)
})