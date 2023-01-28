import { Request, Response } from 'express';
import { AppDataSource } from './../data-source';
import { User } from './../entity/User';

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

      res.send(user);
    } catch (error) {
      return res.status(404).json({ message: 'Username or password is incorrect!' });
    }
  };
}

export default AuthController;
