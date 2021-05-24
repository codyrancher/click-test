import { ok } from 'assert';
import { NextFunction, Request, Response } from 'express';
import { readFileSync, writeFile, existsSync } from 'fs';

const PATH = './data/tasklists.json';

const taskLists = existsSync(PATH) ? JSON.parse(readFileSync(PATH, 'utf8')) : [];

class CreateTaskController {
  public list = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.send(taskLists);
    } catch (error) {
      next(error);
    }
  };


  public get = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.send(taskLists.find(task => task.tasklistName === req.params.name));
    } catch (error) {
      next(error);
    }
  };

  public post = (req: any, res: Response, next: NextFunction): void => {
    try {
        taskLists.push({
          tasklistName: req.body.tasklistName,
          taskNames: req.body.taskNames,
        });

        writeFile(PATH, JSON.stringify(taskLists), () => {});

      console.log(taskLists);
      
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
}

export default CreateTaskController;
