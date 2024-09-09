import { Request, Response, Router } from 'express';
import * as controllers from '../../controllers/users.controllers';

const routes = Router();

routes.post('/', controllers.create);

routes.get('/', controllers.getAll);

routes.get('/:id', controllers.getById);

routes.patch('/:id', controllers.update);

routes.delete('/:id', controllers.remove);

export default routes;
