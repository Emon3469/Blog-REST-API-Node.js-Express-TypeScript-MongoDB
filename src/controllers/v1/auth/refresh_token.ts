import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { verifyRefreshToken, generateAccessToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import Token from '@/models/token';

import type { Request, Response } from 'express';
import {Types} from 'mongoose';

const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken as string;

    try{
        const tokenExists = await Token.exists({ token: refreshToken });

        if(!tokenExists){
            res.status(401).json({
                code: 'AuthorizationError',
                message: 'Refresh token is invalid or expired',
            });
            return;
        }

        const jwtPayload = verifyRefreshToken(refreshToken) as { userId: Types.ObjectId};
        const accessToken = generateAccessToken(jwtPayload.userId);

        res.status(200).json({
            accessToken,
        });
    }
    catch(err) {
        if(err instanceof TokenExpiredError){
            res.status(401).json({
                code: 'AuthorizationError',
                message: 'Refresh token has expired, please login again',
            });
            return;
        }

        if(err instanceof JsonWebTokenError){
            res.status(401).json({
                code: 'AuthorizationError',
                message: 'Invalid refresh token',
            })
        }
        res.status(500).json({
            code: 'ServerError',
            message: 'An error occurred while processing your request',
            error: err instanceof Error ? err.message : 'Unknown error'
        });

        logger.error('Error checking refresh token existence', err);
    }
}

export default refreshToken;