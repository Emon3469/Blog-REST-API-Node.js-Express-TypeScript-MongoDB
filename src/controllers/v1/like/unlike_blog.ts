import { logger } from '@/lib/winston'

import type { Request, Response} from 'express';
import Like from '@/models/like';
import type { IBlog } from '@/models/blog';
import Blog from '@/models/blog';

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>


const unlikeBlog = async (req: Request, res: Response): Promise<void> => {
   const { blogId } = req.params;
   const { userId } = req.body;

   try{
      const existingLike = await Like.findOne({ userId, blogId}).lean().exec();

      if(!existingLike){
        res.status(404).json({
            code: 'NotFound',
            message: 'Like not found',
        });
        return;
      }

      await Like.deleteOne({ _id: existingLike._id});

      const blog = await Blog.findById(blogId).select('likesCount').exec();

      if(!blog){
        res.status(404).json({
            code: 'NotFound',
            message: 'Like Not Found',
        });
        return;
      }

      blog.likesCount--;
      await blog.save();

      logger.info('Blog unliked successfully', {
        userId,
        blogId: blog._id,
        likesCount: blog.likesCount,
      });

      res.sendStatus(204);
   }
   catch (err) {
     res.status(500).json({
         code: 'ServerError',
         message: 'An unexpected error occurred while processing your request.',
         error: err instanceof Error ? err.message : 'Unknown error',
     });

     logger.error('Error while unliking blog', err);
   }
}

export default unlikeBlog;