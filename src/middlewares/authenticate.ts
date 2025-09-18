import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { verifyAccessToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';

import { Request, Response, NextFunction } from 'express';
import type { Types } from 'mongoose';

const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if(!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({
            code: 'AuthentificationError',
            message: 'Access denied. No access token provided.'
        });
        return;
    }

    const [_, token] = authHeader.split(' ');
    try{
        const jwtPayload = await verifyAccessToken(token) as { userId: Types.ObjectId};

        req.userId = jwtPayload.userId;
        return next();
    }
    catch(err){
       if(err instanceof TokenExpiredError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Access token expired. Please login again.'
            })
            return;
        }

        if(err instanceof JsonWebTokenError) {
        res.status(401).json({
            code: 'AuthenticationError',
            message: 'Invalid access token.'
            });
            return;
        }
        res.status(500).json({
        code: 'ServerError',
        message: 'An unexpected error occurred while processing your request.',
        error : err instanceof Error ? err.message : 'Unknown error'
        });

        logger.error('Authentication middleware error', err);
        return;
    }
}

export default authenticate;