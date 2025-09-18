import { v2 as cloudinary } from 'cloudinary';
import { logger } from '@/lib/winston'

import type { Request, Response} from 'express';
import type { IBlog } from '@/models/blog';
import Blog from '@/models/blog';
import User from '@/models/user';

const deleteBlog = async (req: Request, res: Response): Promise<void> => {
   try{
      const userId = req.userId;
      const blogId = req.params.blogId;

      const user = await User.findById(userId).select('role').lean().exec();
      const blog = await Blog.findById(blogId)
                   .select('Author Banner.PublicId')
                   .lean()
                   .exec();

      if(!blog){
        res.status(404).json({
            code: 'NotFound',
            message: 'Blog not Found',
        });
        return;
      }

      if(blog.author !== userId && user?.role !== 'admin'){
        res.status(403).json({
            code: 'AuthorizationError',
            message: 'Access denied, Insufficient Permission',
        });

        logger.warn('A user tried to delete a blog without permission', {
            userId,
        });
        return;
      }

      await cloudinary.uploader.destroy(blog.banner.publicId);
      logger.info('Blog banner deleted from Cloudinary', {
        publicId: blog.banner.publicId,
      });

      await Blog.deleteOne({ _id: blogId});
      logger.info('Blog deleted successfully', {
        blogId,
      });

      res.sendStatus(204);
   }
   catch (err) {
     res.status(500).json({
         code: 'ServerError',
         message: 'An unexpected error occurred while processing your request.',
         error: err instanceof Error ? err.message : 'Unknown error',
     });

     logger.error('Error while deleteing blog creation', err);
   }
}

export default deleteBlog;