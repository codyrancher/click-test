import { ok } from 'assert';
import { NextFunction, Request, Response } from 'express';
import { existsSync, readFileSync, writeFile } from 'fs';

const PATH = './data/tasks.json';

const tasks = existsSync(PATH) ? JSON.parse(readFileSync(PATH, 'utf8')) : [];

class CreateTaskController {
  public list = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.send(tasks);
    } catch (error) {
      next(error);
    }
  };


  public get = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.send(tasks.find(task => task.taskName === req.params.name));
    } catch (error) {
      next(error);
    }
  };

  public delete = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const index = tasks.findIndex(task => task.taskName === req.params.name);
      if (index >= 0) {
        tasks.splice(index, 1);
        writeFile(PATH, JSON.stringify(tasks), () => {});
      }

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };

  public click = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const task = tasks.find(task => task.taskName === req.params.name);
      console.log(req.body);
      task.clicks.push(req.body);

      writeFile(PATH, JSON.stringify(tasks), () => {});

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };

  public post = (req: any, res: Response, next: NextFunction): void => {
    try {
      tasks.push({
        file: req.file.buffer,
        taskName: req.body.taskName,
        prompt: req.body.prompt,
        regions: JSON.parse(req.body.regions),
        clicks: []
      });

      console.log(tasks);

      writeFile(PATH, JSON.stringify(tasks), () => {});
      
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
}

export default CreateTaskController;
