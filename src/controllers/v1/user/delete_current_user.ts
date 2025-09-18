import { logger } from '@/lib/winston';
import Blog from '@/models/blog';
import User from '@/models/user';
import { v2 as cloudinary } from 'cloudinary';
import type { Request, Response } from 'express';

const deleteCurrentUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
   try{
    const blogs = await Blog.find({ author: userId })
                  .select('banner.publicId')
                  .lean()
                  .exec()
    const publicIds = blogs.map(({ banner }) => banner.publicId);
    await cloudinary.api.delete_resources(publicIds);

    logger.info('Multiple blog banners deleted from Cloudinary', {
      publicIds
    });

    await Blog.deleteMany({ author: userId });
    logger.info('Multiple Blogs deleted', {
      userId,
      blogs
    });

     await User.deleteOne({_id: userId});
     logger.info('A user account has been deleted successfully', { userId });

     res.sendStatus(204);
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

export default deleteCurrentUser;