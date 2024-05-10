import { Database } from 'sqlite3';
import { HttpMethod, Request } from '../interfaces/Request';
import { RequestHandler } from 'express';

export class GetRecipes implements Request {
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

interface CreateRecipeBody {
  name: string,
  locale: string,
  description: string
  ingredients: {
    grocery_item_id: number,
    amount: number,
    amount_unit_id: number,
  }[]
};


export class CreateRecipe implements Request {
  constructor(private database: Database) { }

  httpMethod: HttpMethod = 'put';
  path: string = '/recipe';

  executeQuery<T>(query: string, params: any): Promise<T> {
    return new Promise((resolve, reject) => {
      this.database.all(query, params, (error: any, rows: any) => {
        if (error) {
          const msg = `Error executing database query!\n${error}`;
          console.error(msg);
          return reject(error);
        }
        return resolve(rows as T);
      })
    })
  }

  handler: RequestHandler = async (req, res) => {
    const body = req.body as CreateRecipeBody;

    const rows = await this.executeQuery<{ id: number }[]>(`insert into recipe (locale, name, description) 
        values ($name, $locale, $description)
        returning *;`,
      {
        $name: body.name,
        $locale: body.locale,
        $description: body.description,
      });

    await Promise.all(body.ingredients.map((ingredient) => {
      //return this.executeQuery()
    }))

    console.log(JSON.stringify(rows));

    body.ingredients.forEach(ingredient => {
      this.database.run(
        `insert into recipe_ingredient (recipe_id, grocery_item_id, amount, amount_unit_id)
        values ($recipe_id, $grocery_item_id, $amount, $amount_unit_id);`,
        {
          $recipe_id: rows[0].id,
          $grocery_item_id: ingredient.grocery_item_id,
          $amount: ingredient.amount,
          $amount_unit_id: ingredient.amount_unit_id,
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
    });
  }
}

export const getRecipe: Request = {
  httpMethod: 'get',
  path: '/user',
  handler: (req, res) => {
    res.send({ code: 200 })
  }
}

export const createRecipe: Request = {
  httpMethod: 'get',
  path: '/user',
  handler: (req, res) => {
  }
}

export const updateRecipe: Request = {
  httpMethod: 'get',
  path: '/user',
  handler: (req, res) => {
    res.send({ code: 200 })
  }
}

export const deleteRecipe: Request = {
  httpMethod: 'get',
  path: '/user',
  handler: (req, res) => {
    res.send({ code: 200 })
  }
}
