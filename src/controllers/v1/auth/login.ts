import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import {logger} from "@/lib/winston";
import config from "@/config";
import bcrypt from 'bcrypt';
import User from '@/models/user';
import Token from '@/models/token';

import type { Request, Response } from "express";
import type { IUser } from "@/models/user";

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const login = async (req: Request, res: Response): Promise<void> => {
    try{
        const { email, password } = req.body as UserData;
        
        const user = await User.findOne({email})
        .select('username email role password')
        .lean()
        .exec();

        if(!user){
            res.status(404).json({
                code: 'UserNotFound',
                message: 'User not found with this email'
            });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid email or password'
            });
            return;
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        await Token.create({
            token: refreshToken,
            userId: user._id
        });

        logger.info('Refresh token created for user', {
            userId: user._id,
            email: user.email
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict'
        })


        res.status(200).json({
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
            },
            accessToken
        });

        logger.info('User registered successfully', { userId: user._id, email: user.email });
    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: err instanceof Error ? err.message : 'Unknown error',
        })

        logger.error('Error during user registration',err);
    }
}

export default login;