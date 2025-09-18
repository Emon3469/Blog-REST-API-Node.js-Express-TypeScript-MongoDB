import { Router } from 'express';
import { param, query,body } from 'express-validator';
import multer from 'multer';
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validationError';
import authorize from '@/middlewares/authorize';
import uploadBlogBanner from '@/middlewares/uploadBlogBanner'
import createBlog from '@/controllers/v1/blog/create_blog';
import getAllBlogs from '@/controllers/v1/blog/get_all_blogs';
import getBlogsByUser from '@/controllers/v1/blog/get_blogs_by_user';
import getBlogsBySlug from '@/controllers/v1/blog/get_blog_by_slug';
import updateBlog from '@/controllers/v1/blog/update_blog';
import deleteBlog from '@/controllers/v1/blog/delete_blog';

const upload = multer();

const router = Router();

router.post('/',
            authenticate,
            authorize(['admin']),
            upload.single('banner_image'),
            uploadBlogBanner('post'),
            body('title')
            .trim()
            .notEmpty()
            .withMessage('Title is required')
            .isLength({max: 180})
            .withMessage('Title must be less than 180 characters'),

             body('content')
             .trim()
             .notEmpty()
             .withMessage('Content is required'),

             body('status')
             .optional()
             .isIn(['draft', 'published'])
             .withMessage('Status must be one of the value, draft or published'),
            validationError,
            createBlog
)

router.get('/',
           authenticate,
           authorize(['admin']),
           query('limit')
             .optional()
             .isInt({min : 1, max: 50})
             .withMessage('Limit must be an integer between 1 and 50.'),
           query('offset')
           .optional()
           .isInt({min : 0})
           .withMessage('Offset must be a non-negative integer.'),
           validationError,
           getAllBlogs,
);


router.get('/user/:userId',
           authenticate,
           authorize(['admin']),
           query('limit')
             .optional()
             .isInt({min : 1, max: 50})
             .withMessage('Limit must be an integer between 1 and 50.'),
           query('offset')
           .optional()
           .isInt({min : 0})
           .withMessage('Offset must be a non-negative integer.'),
           validationError,
           getBlogsByUser,
);

router.get('/:slug',
            authenticate,
            authorize(['admin', 'user']),
            param('slug')
            .notEmpty()
            .withMessage('Slug is required'),
            validationError,
            getBlogsBySlug
);

router.put('/:blogId',
           authenticate,
           authorize(['admin']),
           param('blogId').isMongoId().withMessage('Invalid blog Id'),
           upload.single('banner_image'),
           body('title')
           .optional()
           .isLength({ max: 180 })
           .withMessage('Title must be less than 180 Characters'),

           body('content'),
           body('status')
           .optional()
           .isIn(['draft', 'published'])
           .withMessage('Status must be one of the value, draft or published'),
           validationError,
           uploadBlogBanner('put'),
           updateBlog,
);

router.delete(
  '/:blogId',
  authenticate,
  authorize(['admin']),
  deleteBlog,
)

export default router;