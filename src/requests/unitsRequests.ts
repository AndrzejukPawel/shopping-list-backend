import { RequestHandler } from 'express';
import { Database } from 'sqlite3';
import { HttpMethod, Request } from '../interfaces/Request';


export class GetUnits implements Request {
  constructor(private database: Database) { }

  httpMethod: HttpMethod = 'get';
  path: string = '/units';
  handler: RequestHandler = (req, res) => {
    const locale = req.query.locale;
    this.database.all(
      "SELECT * FROM  enum_amount_unit WHERE locale = $locale;",
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
