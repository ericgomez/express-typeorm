# TypeScript with Node.js and Express Build with TypeORM

This template is Build with TypeORM
Run `npx typeorm init --name <project-name> --database <database-name> --express` command

```sh
npx typeorm init --name express-typeorm --database mysql --express
```

## Add dependencies production

```sh
npm install cors helmet jsonwebtoken bcryptjs class-validator
```

## Add dependencies development

```sh
npm install -D ts-node-dev typescript @types/bcryptjs @types/cors @types/jsonwebtoken @types/express @types/node
```

## Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Run `npm start` command
