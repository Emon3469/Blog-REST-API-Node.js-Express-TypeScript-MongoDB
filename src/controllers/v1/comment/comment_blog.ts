import { logger } from '@/lib/winston'
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import type { Request, Response} from 'express';
import type { IComment } from '@/models/comment';
import Comment from '@/models/comment';
import Blog from '@/models/blog';

type CommentData = Pick<IComment, 'content'>

const window = new JSDOM('').window;
const purify = DOMPurify(window);


const commentBlog = async (req: Request, res: Response): Promise<void> => {
   const { content } = req.body as CommentData;
   const { blogId } = req.params;
   const userId = req.userId;

   try{
      const blog = await Blog.findById(blogId).select('_id commentsCount').exec();

      if(!blog){
        res.status(404).json({
            code: 'NotFound',
            message: 'Blog not found',
        });
        return;
      }

      const cleanContent = purify.sanitize(content);

      const newComment = await Comment.create({
        blogId,
        content: cleanContent,
        userId,
      });

      logger.info('New comment create', newComment);

      blog.commentsCount++;
      await blog.save();

      logger.info('Blog liked successfully', {
        blogId: blog._id,
        commentsCount: blog.commentsCount,
      });

      res.status(200).json({
        comment: newComment,
      });
   }
   catch (err) {
     res.status(500).json({
         code: 'ServerError',
         message: 'An unexpected error occurred while processing your request.',
         error: err instanceof Error ? err.message : 'Unknown error',
     });

     logger.error('Error while Commenting blog', err);
   }
}

export default commentBlog;