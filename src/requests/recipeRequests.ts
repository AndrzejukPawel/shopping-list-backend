import { Database } from 'sqlite3';
import { HttpMethod, RequestDefinition } from '../interfaces/method';
import { RequestHandler } from 'express';

export class GetRecipes implements RequestDefinition {
  constructor(private database: Database) { }

  httpMethod: HttpMethod = 'get';
  path: string = '/recipe';
  handler: RequestHandler = (req, res) => {
    this.database.all(
      `select * from recipe;`,
      (error, rows) => {
        if (error) {
          const msg = `Error executing database query!\n${error}`;
          console.error(msg);
          return res.status(500).send(msg);
        }
        return res.status(200).send(JSON.stringify(rows));
      }
    );
  }
}

export const getRecipe: RequestDefinition = {
  httpMethod: 'get',
  path: '/user',
  handler: (req, res) => {
    res.send({ code: 200 })
  }
}

export const createRecipe: RequestDefinition = {
  httpMethod: 'get',
  path: '/user',
  handler: (req, res) => {
    res.send({ code: 200 })
  }
}

export const updateRecipe: RequestDefinition = {
  httpMethod: 'get',
  path: '/user',
  handler: (req, res) => {
    res.send({ code: 200 })
  }
}

export const deleteRecipe: RequestDefinition = {
  httpMethod: 'get',
  path: '/user',
  handler: (req, res) => {
    res.send({ code: 200 })
  }
}
