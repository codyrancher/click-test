import { Router } from 'express';
import IndexController from '../controllers/tasks.controller';
import Route from '../interfaces/routes.interface';
import Multer from 'multer';

const upload = Multer({ storage: Multer.memoryStorage() });
class IndexRoute implements Route {
  public path = '/api/tasks';
  public router = Router();
  public indexController = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.indexController.list);
    this.router.get(`${this.path}/:name`, this.indexController.get);
    this.router.put(`${this.path}/:name/click`, this.indexController.click);
    this.router.post(`${this.path}`, upload.single('file'), this.indexController.post);
  }
}

export default IndexRoute;