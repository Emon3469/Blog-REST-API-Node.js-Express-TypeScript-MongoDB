import { logger } from "@/lib/winston";
import config from "@/config";
import { genUsername } from "@/utils";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt"; 
import type { Request, Response } from 'express';
import type { IUser } from "@/models/user";
import User from '@/models/user'
import Token from '@/models/token';

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
    const {email, password, role} = req.body as UserData;
    
    if( role === 'admin' && !config.WHITELIST_ADMINS_MAIL.includes(email)) {
        res.status(403).json({
            code: 'AuthorizationError',
            message: 'You are not authorized to register as an admin',
        });

        logger.warn(`User with email ${email} attempted to register as admin without authorization`);
        return;
    }

    try{
        const username = genUsername();
        const newUser = await User.create({
            username,
            email,
            password,
            role,
        });

        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);

        await Token.create({
            token: refreshToken,
            userId: newUser._id
        });

        logger.info('Refresh token created for user', {
            userId: newUser._id,
            email: newUser.email
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict'
        })


        res.status(201).json({
            user: {
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
            accessToken
        });

        logger.info('User registered successfully', { userId: newUser._id, email: newUser.email });
    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: err
        })

        logger.error('Error during user registration',err);
    }
}

export default register;