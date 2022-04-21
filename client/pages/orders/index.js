const OrderIndex = ({  orders }) => { 
    return (
        <ul>
            {orders.map(orders => { 
                return <li key={orders.id}>
                    {orders.ticket.title} - { orders.status }
                </li>
            })}
        </ul>
    )
}

OrderIndex.getInitialProps = async (context, client) => { 
    const { data } = await client.get('/api/orders')

    return { orders: data }
}

export default OrderIndex