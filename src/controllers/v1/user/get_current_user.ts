import { logger } from '@/lib/winston';
import User from '@/models/user';
import type { Request, Response } from 'express';

const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
   try {
     const userId = req.userId;
     const user = await User.findById(userId).select('-__v').exec();

     res.status(200).json({
        user,
     });
   }
   catch (err) {
     res.status(500).json({
         code: 'ServerError',
         message: 'An unexpected error occurred while processing your request.',
         error: err instanceof Error ? err.message : 'Unknown error',
     });

     logger.error('Error while fetching current user', err);
   }
};

export default getCurrentUser;