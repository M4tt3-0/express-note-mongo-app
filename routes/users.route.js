import express, { request, response } from 'express';
import { body } from 'express-validator';
import { validationResult } from 'express-validator';
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import jwtauthMiddleware from '../middlewares/jwt.middleware.js';

const usersRoute = express.Router()

usersRoute.post(
    '/api/register',
    body('username').isLenght({min: 1, max: 50}),
    body('email').isEmail(),
    body('password').isLenght({min: 8, max: 20}),
    async (request, response) => {
        const errors = validationResult(request)
        if(!errors.isEmpty()) {
            return response.status(400).json({
                status: 'fail',
                errors: errors.array()

            })
        }

        const encryptedPassword = await bcrypt.hash(request.body.password, 12)
        
        try {

            const user = new User({
                user: request.body.username,
                email: request.body.email,
                password: encryptedPassword
            })

            await user.save()

            delete user.password
            delete user._id

            return response.status(201).json({
                status: 'succes',
                data: {
                    username: user.username,
                    email: user.email,
                    active: user.active
                }
            })

        } catch(err) {

            return response.status(400).json({
                status: 'fail',
                data: err.toString()
            })
        }
    })

    usersRoute.get(
        '/api/users',
        jwtauthMiddleware,
        async (request, response) => {
            try {

                const users = await User.find({}).select([
                    'username', 'email', 'active'
                ])

                return response.status(200).json({
                    status : 'succes',
                    data: users
                })

            } catch(err) {

                return response.status(400).json({
                    status: 'fail',
                    data: err.toString()
                })
            }
        })

        usersRoute.post(
            '/api/login',
            body('email').isEmail(),
            body('password').isLenght({min: 8, max: 20}),
            async (request, response) => {
                const errors = validationResult(request)

                if(!errors.isEmpty()) {
                    return response.status(400).json({
                        status: 'fail',
                        errors: errors.array()
                    })
                }

                try {

                    const user = await User.findOne({email: request.body.email})
                    const decryptedPassowrd = await bcrypt.compare(request.body.password, user.password)
                    const result = decryptedPassowrd ? 'password corretta' : 'password sbagliata'
                    
                    console.log(decryptedPassowrd)
                    console.log(user)

                    const userJWT = {
                        _id: user.id,
                        username: user.username,
                        email: user.email,
                        active: user.active
                    }

                    const jwtToken = jwt.sign(userJWT, process.env.JWT_SECRET, {
                        expiresIn: 3000
                    })

                    return response.status(200).json({
                        status: 'success',
                        token: jwtToken,
                        passwordCheck: result,
                        data: userJWT
                    })

                } catch(err) {

                    return response.status(404).json({
                        status: 'fail',
                    })
                }
            }
        )

        export default usersRoute

