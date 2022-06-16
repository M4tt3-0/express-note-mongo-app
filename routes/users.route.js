import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/user.js';
import bcrypt from 'bcrypt';

const usersRoute = express.Router();

usersRoute.post(
  '/api/register',
  body('username').isLength({ min: 5, max: 10 }),
  body('email').isEmail(),
  body('password').isLength({ min: 8, max: 50 }),
  async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({
        status: 'fail',
        errors: errors.array(),
      });
    }

    const encryptedPassword = await bcrypt.hash(request.body.password, 12);
    try {
      const user = new User({
        username: request.body.username,
        email: request.body.email,
        password: encryptedPassword,
      });
      await user.save();

      return response.status(201).json({
        status: 'success',
        data: user,
      });
    } catch (err) {
      return response.status(404).json({
        status: 'fail',
        error: err.toString(),
      });
    }
  },
);

export default usersRoute;
