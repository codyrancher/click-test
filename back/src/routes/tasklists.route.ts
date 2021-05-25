import { Router } from 'express';
import IndexController from '../controllers/tasklists.controller';
import Route from '../interfaces/routes.interface';

class IndexRoute implements Route {
  public path = '/api/tasklists';
  public router = Router();
  public indexController = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.indexController.list);
    this.router.get(`${this.path}/:name`, this.indexController.get);
    this.router.delete(`${this.path}/:name`, this.indexController.delete);
    this.router.post(`${this.path}`, this.indexController.post);
  }
}

export default IndexRoute;
