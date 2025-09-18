import { Router } from "express";
import { body, param } from "express-validator";
import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import validationError from "@/middlewares/validationError";
import commentBlog from '@/controllers/v1/comment/comment_blog';
import getCommentsByBlog from "@/controllers/v1/comment/get_comments_by_blog";
import deleteComment from "@/controllers/v1/comment/delete_comment";

const router = Router();

router.post('/blog/:blogId',
            authenticate,
            authorize(['admin', 'user']),
            param('blogId').isMongoId()
            .withMessage('Invalid blog ID'),

            body('content')
            .trim()
            .notEmpty()
            .withMessage('User id is required'),
            validationError,
            commentBlog
);

router.get('/blog/:blogId',
           authenticate,
           authorize(['admin', 'user']),
           param('blogId').isMongoId().withMessage('Invalid Blog ID'),
           validationError,
           getCommentsByBlog,
);

router.delete('/blog/:blogId',
            authenticate,
            authorize(['admin', 'user']),
            param('blogId').isMongoId()
            .withMessage('Invalid blog ID'),
            deleteComment,
);

export default Router;