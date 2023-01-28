import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { validate } from 'class-validator';
import { AppDataSource } from './../data-source';
import { User } from './../entity/User';
import config from '../config/config';

class AuthController {
  static login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!(username && password)) {
      return res.status(400).json({ message: 'Username and password are required!' });
    }

    const userRepository = AppDataSource.getRepository(User);

    try {
      const user = await userRepository.findOneOrFail({ where: { username } });

      // Check password
      if (!user.checkPassword(password)) {
        return res.status(400).json({ message: 'Username or password is incorrect!' });
      }

      const token = jwt.sign({ userId: user.id, username: user.username }, config.jwtSecret, { expiresIn: '1h' });

      res.json({ messge: 'OK', token });
    } catch (error) {
      return res.status(404).json({ message: 'Username or password is incorrect!' });
    }
  };

  static changePassword = async (req: Request, res: Response) => {
    const { userId } = res.locals.jwtPayload;
    const { oldPassword, newPassword } = req.body;

    if (oldPassword && newPassword) {
      res.status(400).json({ message: 'Old password and new password are not allowed!' });
    }

    const userRepository = AppDataSource.getRepository(User);
    let user: User;

    try {
      user = await userRepository.findOneOrFail(userId);
    } catch (error) {
      res.status(400).json({ message: 'Something goes wrong!' });
    }

    if (!user.checkPassword(oldPassword)) {
      return res.status(400).json({ message: 'Old password is incorrect!' });
    }

    user.password = newPassword;
    // validate by of class-validator
    const errors = await validate(user, { validationError: { target: false, value: false } });

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    // Hash password
    user.hashPassword();
    userRepository.save(user);

    res.status(200).json({ message: 'Password changed successfully!' });
  };
}

export default AuthController;
