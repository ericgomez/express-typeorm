import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'db4free.net',
  port: 3306,
  username: 'kjb6vhareb',
  password: 'rrRMJG#.g@nSh8*',
  database: 'kzq5gchfxvuic2t',
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
