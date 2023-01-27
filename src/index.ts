import * as express from 'express';
import * as cors from 'cors';
import helmet from 'helmet';
import { AppDataSource } from './data-source';
import routes from './routes';

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    // Middleware
    app.use(cors());
    app.use(helmet());
    app.use(express.json());

    // setup express app here
    // Routes
    app.use('/api', routes);

    // start express server
    app.listen(PORT, () => console.log(`Express server has started on port ${PORT}. Open http://localhost:${PORT}`));
  })
  .catch((error) => console.log(error));
