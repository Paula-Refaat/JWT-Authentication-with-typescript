import { Router } from 'express';

import * as controllers from '../../controllers/users.controllers';
import validateTokenMiddleware from '../../middleware/authentication.middleware';

const routes = Router();

routes
  .route('/')
  .post(controllers.create)
  .get(validateTokenMiddleware, controllers.getAll);
routes
  .route('/:id')
  .get(controllers.getOne)
  .patch(controllers.updateOne)
  .delete(controllers.deleteOne);

routes.route('/authenticate').post(controllers.authenticate);

export default routes;
