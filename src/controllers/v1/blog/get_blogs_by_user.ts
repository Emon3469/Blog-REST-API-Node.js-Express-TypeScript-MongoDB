import { logger } from '@/lib/winston';
import Blog from '@/models/blog';
import User from '@/models/user';
import config from '@/config';
import type { Request, Response } from 'express';

interface QueryType {
    status?: 'draft' | 'published';
}

const getBlogsByUser = async (req: Request, res: Response): Promise<void> => {
   try{
     const userId = req.params.userId;
     const currentUserId = req.userId;
     const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
     const offset = parseInt(req.query.offset as string) || config.defaultResOffset;
     const currentUser = await User.findById(userId).select('role').lean().exec();
     const query : QueryType = {};
     
     const total = await Blog.countDocuments({author: userId, query});
     if(currentUser?.role === 'user'){
        query.status = 'published';
     }

     const blogs = await Blog.find(query)
     .select('-banner.publicId-__v')
     .populate('author', '-createdAt -updatedAt -__v')
     .limit(limit)
     .skip(offset)
     .sort({createdAt : -1})
     .lean()
     .exec();
     

     res.status(200).json({
        limit,
        offset,
        total,
        blogs,
     });
   }
   catch (err) {
     res.status(500).json({
         code: 'ServerError',
         message: 'An unexpected error occurred while processing your request.',
         error: err instanceof Error ? err.message : 'Unknown error',
     });

     logger.error('Error while fetching blogs by User', err);
   }
}

export default getBlogsByUser;