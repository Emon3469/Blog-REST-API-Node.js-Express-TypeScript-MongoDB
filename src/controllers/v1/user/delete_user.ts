import { logger } from '@/lib/winston';
import User from '@/models/user';
import type { Request, Response } from 'express';

const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
   try{
     await User.deleteOne({_id: userId});
     logger.info('A user account has been deleted successfully', { userId });
   }
   catch (err) {
     res.status(500).json({
         code: 'ServerError',
         message: 'An unexpected error occurred while processing your request.',
         error: err instanceof Error ? err.message : 'Unknown error',
     });

     logger.error('Error while deleteing current user', err);
   }
}

export default deleteUser;