import mongoose from 'mongoose'
import { app } from './app'
import { natsWrapper } from './nats-wrapper'

const start = async () => { 
    if (!process.env.JWT_KEY) { 
        throw new Error('JWT_KEY must be defined')
    }
    if (!process.env.MONGO_URI) { 
        throw new Error('MONGO_URI must be defined')
    }
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
        

        await mongoose.connect(process.env.MONGO_URI)
        console.log('connected to mongodb')
    } catch (err) { 
        console.log(err)
    }

    app.listen(3000, () => { 
        console.log('listening on port 3000!!!!!!!')
    })
}


start()
