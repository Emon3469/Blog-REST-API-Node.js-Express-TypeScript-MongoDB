import { logger } from '@/lib/winston';
import User from '@/models/user';
import config from '@/config';
import type { Request, Response } from 'express';

const getUser = async (req: Request, res: Response): Promise<void> => {
   try{
     const userId = req.params.userId;

     const user = await User.findById(userId).select('-__v').exec();

     if(!user){
         res.status(404).json({
             code: 'UserNotFound',
             message: 'User not found'
         });
         return;
     }

     res.status(200).json({
        user,
     })
   }
   catch (err) {
     res.status(500).json({
         code: 'ServerError',
         message: 'An unexpected error occurred while processing your request.',
         error: err instanceof Error ? err.message : 'Unknown error',
     });

     logger.error('Error while getting all current user', err);
   }
}

export default getUser;