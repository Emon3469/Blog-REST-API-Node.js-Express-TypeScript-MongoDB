import { logger } from '@/lib/winston'
import type { Request, Response} from 'express';
import Comment from '@/models/comment';
import User from '@/models/user';
import Blog from '@/models/blog';


const deleteComment = async (req: Request, res: Response): Promise<void> => {
   const currentUserId = req.userId;
   const { commentId } = req.params;
   try{
      const comment = await Comment.findById(commentId).select('userId blogId').exec();
      const user = await User.findById(currentUserId).select('role').exec();

      if(!comment){
        res.status(404).json({
            code: 'NotFound',
            message: 'Comment not found',
        });
        return;
      }

      const blog = await Blog.findById(comment.blogId).select('commentsCount').exec();
      if(!blog){
        res.status(404).json({
            code: 'NotFound',
            message: 'Comment not found',
        });
        return;
      }

      if(comment.userId !== currentUserId && user?.role !== 'admin'){
        res.status(403).json({
            code: 'AuthorizationError',
            message: 'Access denied, Insufficient Permission',
        });

        logger.warn('A user tried to delete a comment without permission', {
            userId: currentUserId,
            comment,
        });
        return;
      }

      await Comment.deleteOne({ _id: commentId});

      logger.info('Comment deleted successfully', {
        commentId
      });

      blog.commentsCount--;
      await blog.save();

      logger.info('Blog comments count updated', {
        blogId: blog._id,
        commentsCount: blog?.commentsCount
      });

      res.sendStatus(204);
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

export default deleteComment;