import { logger } from '@/lib/winston'
import type { Request, Response} from 'express';
import Comment from '@/models/comment';
import Blog from '@/models/blog';


const getCommentsByBlog = async (req: Request, res: Response): Promise<void> => {
   const { blogId } = req.params;
   try{
      const blog = await Blog.findById(blogId).select('_id').lean().exec();

      if(!blog){
        res.status(404).json({
            code: 'NotFound',
            message: 'Blog not found',
        });
        return;
      }
      const allComments = await Comment.find({ blogId }).sort({ createdAt: -1 }).lean().exec();

      res.status(200).json({
        comments: allComments,
      });
   }
   catch (err) {
     res.status(500).json({
         code: 'ServerError',
         message: 'An unexpected error occurred while processing your request.',
         error: err instanceof Error ? err.message : 'Unknown error',
     });

     logger.error('Error while reteriving blog', err);
   }
}

export default getCommentsByBlog;