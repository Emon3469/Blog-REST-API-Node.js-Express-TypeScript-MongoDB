import { logger } from '@/lib/winston'

import type { Request, Response} from 'express';
import Like from '@/models/like';
import type { IBlog } from '@/models/blog';
import Blog from '@/models/blog';

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>


const likeBlog = async (req: Request, res: Response): Promise<void> => {
   const { blogId } = req.params;
   const { userId } = req.body;

   try{
      const blog = await Blog.findById(blogId).select('likesCount').exec();

      if(!blog){
        res.status(404).json({
            code: 'NotFound',
            message: 'Blog not found',
        });
        return;
      }

      const existingLike = await Like.findOne({ blogId, userId}).lean().exec();
      if(existingLike){
        res.status(400).json({
            code: 'BadRequest',
            message: 'You already liked this blog',
        });
        return;
      }

      await Like.create({blogId, userId});

      blog.likesCount++;
      await blog.save();

      logger.info('Blog liked successfully', {
        userId,
        blogId: blog._id,
        likesCount: blog.likesCount,
      });

      res.status(200).json({
        likesCount: blog.likesCount,
      })
   }
   catch (err) {
     res.status(500).json({
         code: 'ServerError',
         message: 'An unexpected error occurred while processing your request.',
         error: err instanceof Error ? err.message : 'Unknown error',
     });

     logger.error('Error while liking blog', err);
   }
}

export default likeBlog;