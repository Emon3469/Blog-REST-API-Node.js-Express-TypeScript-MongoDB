import { Router } from 'express';
import { param, query,body } from 'express-validator';
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validationError';
import authorize from '@/middlewares/authorize';
import getCurrentUser from '@/controllers/v1/user/get_current_user';
import updateCurrentUser from '@/controllers/v1/user/update_current_user';
import deleteCurrentUser from '@/controllers/v1/user/delete_current_user';
import getAllUser from '@/controllers/v1/user/get_all_user';
import getUser from '@/controllers/v1/user/get_user';
import deleteUser from '@/controllers/v1/user/delete_user';
import User from '@/models/user';

const router = Router();

router.get('/current', authenticate, 
           authorize(['admin', 'user']),
           getCurrentUser,
);

router.put('/current', 
            authenticate,
            authorize(['admin', 'user']),
            body('username').optional()
            .trim()
            .isLength({max : 20})
            .withMessage('Username must be at most 20 characters long.')
            .custom(async (value) => {
                const userExists = await User.exists({ username: value });

                if (userExists) {
                    throw Error('This username is already Exists.');
                }
            }),

            body('email').optional()
            .isLength({max : 50 })
            .withMessage('Email must be at most 50 characters long.')
            .isEmail()
            .withMessage('Invalid email format.')
            .custom(async (value) => {
                const emailExists = await User.exists({ email: value });

                if (emailExists) {
                    throw Error('This email is already Exists.');
                }
            }),

            body('password').optional()
            .isLength({ min: 8})
            .withMessage('Password must be at least 8 characters long.'),

            body('firstName').optional()
            .isLength({ max: 20})
            .withMessage('First name must be at most 20 characters long.'),

            body('lastName').optional()
            .isLength({ max: 20})
            .withMessage('Last name must be at most 20 characters long.'),

            body(['website', 'facebook', 'instagram', 'linkedin', 'youtube']).optional()
            .isURL()
            .withMessage('Invalid URL format.')
            .isLength({ max: 100 })
            .withMessage('Social link must be at most 100 characters long.'),

            validationError,
            updateCurrentUser,
)


router.delete('/current', 
              authenticate,
              authorize(['admin', 'user']),
              deleteCurrentUser,
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
           getAllUser,
)


router.get('/:userId',
            authenticate,
            authorize(['admin']),
            param('userId').notEmpty().isMongoId().withMessage('Invalid user ID format.'),
            validationError,
            getUser
);

router.get('/:userId',
    authenticate,
    authorize(['admin']),
    param('userId').notEmpty()
    .isMongoId()
    .withMessage('Invalid user Id'),
    validationError,
    deleteUser,
)
export default router;