import express from 'express';
import config from './config';
import cors, { CorsOptions } from 'cors';
import limiter from './lib/express_rate_limit';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import v1Routes from '@/routes/v1';
import { ConnectToDatabase, disconnectFromDatabase } from '@/lib/mongoose'
import { logger } from '@/lib/winston'

const app = express();

const corsOptions: CorsOptions = {
    origin(origin, callback){
        if(config.NODE_ENV === 'development' || !origin || 
            config.WHITELIST_ORIGINS.includes(origin)){
                callback(null, true);
            }
        else{
           callback(new Error(`CORS Error : ${origin} is not allowd by CORS`), false);
           logger.warn(`CORS Error : ${origin} is not allowd by CORS`);
        }
    }
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(
    compression({
        threshold: 1024,
    }),
);
app.use(helmet());
app.use(limiter);

(async () => {
    try{
       
       await ConnectToDatabase();

       app.use('/api/v1', v1Routes);

       app.listen(config.PORT, () => {
           logger.info(`Server running : http://locathost:${config.PORT}`);
        });
    }
    catch(err){
        logger.error('Failed to start the server', err);
        if(config.NODE_ENV === 'Production'){
            process.exit(1);
        }
    }
})();

const handleServerShutdown = async () => {
    try{
        await disconnectFromDatabase();
        logger.warn('Server SHUTDOWN');
        process.exit(0);
    }
    catch(err){
        logger.error('Error during server shutdown', err);
    }
}

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
