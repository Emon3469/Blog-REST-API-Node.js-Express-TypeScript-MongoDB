import DOMPurify from 'dompurify';
import {JSDOM} from 'jsdom';
import { logger } from '@/lib/winston'

import type { Request, Response} from 'express';
import type { IBlog } from '@/models/blog';
import Blog from '@/models/blog';

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const generateSlug = (title: string): string => {
    return title
           .toLowerCase()
           .replace(/[^a-z0-9]+/g, '-')
           .replace(/^-+|-+$/g, '');
}

const createBlog = async (req: Request, res: Response): Promise<void> => {
   try{
      const {title , content, banner, status} = req.body as BlogData;
      const userId = req.userId;

      const cleanContent = purify.sanitize(content);
      const slug = generateSlug(title);

      const newBlog = await Blog.create({
        title,
        slug,
        content: cleanContent,
        banner,
        status,
        author: userId
      });

      logger.info('New blog create', newBlog);

      res.status(201).json({
        blog: newBlog,
      });
   }
   catch (err) {
     res.status(500).json({
         code: 'ServerError',
         message: 'An unexpected error occurred while processing your request.',
         error: err instanceof Error ? err.message : 'Unknown error',
     });

     logger.error('Error while creating current user', err);
   }
}

export default createBlog;