import { logger } from '@/lib/winston';
import config from '@/config';
import Token from '@/models/token';
import { Request, Response } from 'express';
import { ref } from 'process';
import user from '@/models/user';

const logout = async (req: Request, res: Response): Promise<void> => {
    try{
        const refreshToken = req.cookies.refreshToken as string;
        if(refreshToken) {
            await Token.deleteOne({ token: refreshToken });

            logger.info('User refresh token deleted successfully', {
                userId: req.userId,
                token : refreshToken
            });
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
        })
        
        res.status(204);

        logger.info('User logged out successfully', {
            userId: req.userId,
        });
    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: err
        })

        logger.error('Error during user registration',err);
    }
}

export default logout;