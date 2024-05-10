import { RequestHandler } from 'express';
import { Database } from 'sqlite3';
import { HttpMethod, Request } from '../interfaces/Request';
import { User } from '../models/user';


export class GetUser implements Request {
  constructor(private database: Database) { }

  httpMethod: HttpMethod = 'get';
  path: string = '/user/:userId';
  handler: RequestHandler = (req, res) => {
    const userId = req.params.userId;
    this.database.get(
      "SELECT * FROM  user WHERE id = $id;",
      {
        $id: userId,
      },
      (error, result) => {
        if (error) {
          const msg = `Error executing database query!\n${error}`;
          console.error(msg);
          return res.status(500).send(msg);
        }
        return res.status(200).send(JSON.stringify(result));
      }
    );
  }
}

export class CreateUser implements Request {
  constructor(private database: Database) { }

  httpMethod: HttpMethod = 'put';
  path: string = '/user';
  handler: RequestHandler = (req, res) => {
    const user = req.body as User;
    this.database.run(
      "insert into user(id, name) values ($id, $name);",
      {
        $id: user.id,
        $name: user.name,
      },
      (error) => {
        if (error) {
          const msg = `Error executing database query!\n${error}`;
          console.error(msg);
          return res.status(500).send(msg);
        }
        return res.status(200).send();
      }
    );
  }
}
