import { NextFunction, Request, Response } from 'express';
import { validate } from 'class-validator';
import { AppDataSource } from './../data-source';
import { User } from './../entity/User';

class UserController {
  static getAll = async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = AppDataSource.getRepository(User);
    try {
      const users = await userRepository.find();

      if (users.length > 0) {
        res.send(users);
      } else {
        res.status(404).json({ message: 'Not result' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);

    const userRepository = AppDataSource.getRepository(User);
    try {
      const user = await userRepository.findOneOrFail({
        where: { id },
      });
      res.send(user);
    } catch (error) {
      res.status(404).json({ message: 'Not result' });
    }
  };

  static newUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, role } = req.body;
    const user = Object.assign(new User(), {
      username,
      password,
      role,
    });

    // validations
    const errors = await validate(user, { validationError: { target: false, value: false } });
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    // TODO: HASH PASSWORD

    const userRepository = AppDataSource.getRepository(User);
    try {
      user.hashPassword();
      await userRepository.save(user);
    } catch (error) {
      return res.status(409).json({ message: 'Username already exist' });
    }

    // All Ok
    res.status(201).json({ message: 'User created' });
  };

  static editUser = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    const { username, role } = req.body;
    let user;

    const userRepository = AppDataSource.getRepository(User);
    try {
      user = await userRepository.findOneByOrFail({ id });
      // We change the data from the database to that of the request body
      user.username = username;
      user.role = role;
    } catch (error) {
      return res.status(404).json({ message: 'User not found' });
    }

    const errors = await validate(user, { validationError: { target: false, value: false } });
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    try {
      await userRepository.save(user);
    } catch (error) {
      return res.status(409).json({ message: 'Username already in use' });
    }

    // All Ok
    res.status(201).json({ message: 'User update' });
  };

  static deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);

    let user: User;
    const userRepository = AppDataSource.getRepository(User);

    try {
      user = await userRepository.findOneByOrFail({ id });
    } catch (error) {
      return res.sendStatus(404).json({ message: 'User not found' });
    }

    // Delete user from database
    await userRepository.remove(user);
    res.status(200).json({ message: 'User deleted' });
  };
}

export default UserController;
