import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from './../data-source';
import { User } from './../entity/User';

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = res.locals.jwtPayload;

    const userRepository = AppDataSource.getRepository(User);
    let user: User;

    try {
      user = await userRepository.findOneOrFail(userId);
    } catch (error) {
      return res.status(401).json({ message: 'Not Authorized' });
    }

    const { role } = user;

    // Checks if the user's role exists in the roles required by the route
    if (!roles.includes(role)) {
      next();
    } else {
      res.status(401).json({ message: 'Not Authorized' });
    }
  };
};
