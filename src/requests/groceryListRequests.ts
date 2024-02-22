import { RequestHandler } from 'express';
import { HttpMethod, RequestDefinition } from '../interfaces/method';
import { Database } from 'sqlite3';
import { GroceryList } from '../models/groceryList';
import { GroceryListItem } from '../models/groceryListItem';

export class GetUserGroceryLists implements RequestDefinition {
  constructor(private database: Database) { }

  httpMethod: HttpMethod = 'get';
  path: string = '/groceryList';
  handler: RequestHandler = (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).send();

    this.database.all(
      `select gl.*
            from grocery_list_access_level glal join grocery_list gl on glal.grocery_list_id = gl.id 
            where glal.user_id = $id;`,
      {
        $id: userId,
      },
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

export class GetUserGroceryList implements RequestDefinition {
  constructor(private database: Database) { }

  httpMethod: HttpMethod = 'get';
  path: string = '/groceryList/:listId';
  handler: RequestHandler = (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).send();

    const listId = req.params.listId;
    this.database.all(
      `select gl.*
            from grocery_list_access_level glal
            join grocery_list gl on glal.grocery_list_id = gl.id
            where glal.user_id = $id and glal.grocery_list_id = $list_id;`,
      {
        $id: userId,
        $list_id: listId
      },
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

export class CreateGroceryList implements RequestDefinition {
  constructor(private database: Database) { }
  httpMethod: HttpMethod = 'put';
  path: string = '/groceryList';
  handler: RequestHandler = (req, res) => {
    const list = req.body as GroceryList;
    this.database.run(
      `insert into grocery_list(name, created_at, updated_at) 
            values($name, $created_at, $created_at);
      insert into grocery_list_access_level(name, created_at, updated_at)
            values($name, $created_at, $created_at); `,
      {
        $name: list.name,
        $created_at: new Date().toISOString(),
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

export class UpdateGroceryList implements RequestDefinition {
  constructor(private database: Database) { }
  httpMethod: HttpMethod = 'patch';
  path: string = '/groceryList';
  handler: RequestHandler = (req, res) => {
    const list = req.body as GroceryList;
    this.database.run(
      `update grocery_list
            set name = $name, updated_at = $updated_at
            where id = $id;`,
      {
        $name: list.name,
        $updated_at: new Date().toISOString(),
        $id: list.id,
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

export class DeleteGroceryList implements RequestDefinition {
  constructor(private database: Database) { }
  httpMethod: HttpMethod = 'delete';
  path: string = '/groceryList/:listId';
  handler: RequestHandler = (req, res) => {
    const listId = req.params.listId;
    this.database.run(
      `delete from grocery_list_item where grocery_list_id = $id;`,
      {
        $id: listId,
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
    this.database.run(
      `delete from grocery_list where id = $id;`,
      {
        $id: listId,
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

export class GetGroceryListItem implements RequestDefinition {
  constructor(private database: Database) { }
  httpMethod: HttpMethod = 'get';
  path: string = '/groceryList/:listId/item';
  handler: RequestHandler = (req, res) => {
    const locale = req.query.locale;
    const listId = req.params.listId;
    this.database.all(
      `select gli.id, git.name, gli.amount, aut."translation" as unit_translation, aut.short_translation as unit_short_translation, gli.bought
        FROM grocery_list_item gli
        left join grocery_item gi on gli.grocery_item_id = gi.id
        left join grocery_item_translation git on gi.id = git.grocery_item_id  and git.locale = $locale
        left join amount_unit_translation aut on gli.amount_unit_id = aut.id and aut.locale = $locale
        where gli.grocery_list_id = $list_id;`,
      {
        $list_id: listId,
        $locale: locale
      },
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

export class AddItemToGroceryList implements RequestDefinition {
  constructor(private database: Database) { }
  httpMethod: HttpMethod = 'put';
  path: string = '/groceryList/:listId/item';
  handler: RequestHandler = (req, res) => {
    const listId = req.params.listId;
    const locale = req.query.locale;
    const item = req.body as GroceryListItem;
    this.database.run(
      `insert into grocery_list_item(grocery_list_id, grocery_item_id, amount, amount_unit_id) values
            ($list_id, $item_id, $amount, $unit_id);`,
      {
        $list_id: item.grocery_list_id,
        $item_id: item.grocery_item_id,
        $amount: item.amount,
        $unit_id: item.amount_unit_id,
      },
      (error) => {
        if (error) {
          const msg = `Error executing database query!\n${error}`;
          console.error(msg);
          return res.status(500).send(msg);
        }
        this.database.get(
          `select gli.id, git.name, gli.amount, aut."translation" as unit_translation, aut.short_translation as unit_short_translation, gli.bought
            FROM grocery_list_item gli
            left join grocery_item gi on gli.grocery_item_id = gi.id
            left join grocery_item_translation git on gi.id = git.grocery_item_id  and git.locale = $locale
            left join amount_unit_translation aut on gli.amount_unit_id = aut.id and aut.locale = $locale
            where gli.id = last_insert_rowid();`,
          { $locale: locale },
          (error, row) => {
            if (error) {
              const msg = `Error executing database query!\n${error}`;
              console.error(msg);
              return res.status(500).send(msg);
            }
            console.log(JSON.stringify(row))
            return res.status(200).send(JSON.stringify(row));
          }
        );
      }
    );
  }
}

export class UpdateGroceryListItemBoughtStatus implements RequestDefinition {
  constructor(private database: Database) { }
  httpMethod: HttpMethod = 'patch';
  path: string = '/groceryList/:listId/item/:itemId';
  handler: RequestHandler = (req, res) => {
    const itemId = req.params.itemId;
    const item = req.body as GroceryListItem;
    console.log(`itemId: ${itemId}, ${JSON.stringify(item)} `);
    this.database.run(
      `update grocery_list_item
        set bought = $bought
        where id = $item_id;
      `,
      {
        $bought: item.bought,
        $item_id: itemId,
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

export class DeleteGroceryListItem implements RequestDefinition {
  constructor(private database: Database) { }
  httpMethod: HttpMethod = 'delete';
  path: string = '/groceryList/:listId/item/:itemId';
  handler: RequestHandler = (req, res) => {
    const itemId = req.params.itemId;
    this.database.run(
      `delete from grocery_list_item
            where id = $item_id;`,
      {
        $item_id: itemId,
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


