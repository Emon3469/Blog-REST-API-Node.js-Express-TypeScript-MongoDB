import { logger } from '@/lib/winston';
import User from '@/models/user';

import type { Request, Response, NextFunction } from 'express';
export type AuthRole = 'admin' | 'user';

const authorize = (roles: AuthRole[]) => {
   return async (req: Request, res: Response, next: NextFunction) => {
     const userId = req.userId;
     
     try{
        const user = await User.findById(userId).select('role').exec();

        if(!user) {
            res.status(404).json({
                code: 'NotFoundError',
                message: 'User not found'
            });
            return;
        }

        if(!roles.includes(user.role)){
            res.status(403).json({
                code: 'AuthorizationError',
                message: 'You do not have permission to access this resource.'
            });
            return;
        }
        return next();
     }
     catch(err){
        res.status(500).json({
            code: 'ServerError',
            message: 'An unexpected error occurred while processing your request.',
            error: err instanceof Error ? err.message : 'Unknown error',
        });

        logger.error('Error while authorizing user', err);
     }
   }
}

export default authorize;