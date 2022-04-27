import { natsWrapper } from './nats-wrapper'
import { OrderCreatedListener } from './events/listener/order-created-listener'

const start = async () => { 
    console.log('Stateting....')
    if (!process.env.NATS_CLIENT_ID) { 
        throw new Error('MONGO_URI must be defined')
    }
    if (!process.env.NATS_URL) { 
        throw new Error('MONGO_URI must be defined')
    }
    if (!process.env.NATS_CLUSTER_ID) { 
        throw new Error('MONGO_URI must be defined')
    }
    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );

        natsWrapper.client.on("close", () => {
            console.log("Nats connection close!");
            process.exit();
          });
      
        process.on('SIGINT', () => natsWrapper.client.close()); //not work on window
        process.on('SIGTERM', () => natsWrapper.client.close());

        new OrderCreatedListener(natsWrapper.client).listen()

    } catch (err) { 
        console.log(err)
    }
}

start()
