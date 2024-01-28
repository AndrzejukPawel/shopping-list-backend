import { RequestHandler } from 'express';
import { Database } from 'sqlite3';
import { HttpMethod, RequestDefinition } from '../interfaces/method';


export class GetGroceryItems implements RequestDefinition {
  constructor(private database: Database) { }

  httpMethod: HttpMethod = 'get';
  path: string = '/groceryItems';
  handler: RequestHandler = (req, res) => {
    const locale = req.query.locale;
    this.database.all(
      `select gi.*, git.name  
        from grocery_item gi
        left join grocery_item_translation git on gi.id = git.grocery_item_id 
        where locale = $locale; `,
      {
        $locale: locale,
      },
      (error, result) => {
        if (error) {
          const msg = `Error executing database query!\n${error}`;
          console.error(msg);
          return res.status(500).send(msg);
        }
        console.log(JSON.stringify(result));
        return res.status(200).send(JSON.stringify(result));
      }
    );
  }
}
