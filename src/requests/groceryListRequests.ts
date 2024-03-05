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

    this.database.all(`
      select gl.*, gli1.bought, gli2.not_bought
      from grocery_list_permission glp
      join grocery_list gl on glp.grocery_list_id = gl.id
      left join (select grocery_list_id, count(*) as bought
        from grocery_list_item
        where bought == 1
        group by grocery_list_id) gli1  on glp.grocery_list_id = gli1.grocery_list_id
      left join (select grocery_list_id, count(*) as not_bought
        from grocery_list_item
        where bought is NULL or bought == 0
        group by grocery_list_id) gli2  on glp.grocery_list_id = gli2.grocery_list_id
      where glp.user_id = $id;`,
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

interface CreateGroceryListBody {
  owner: string,
  name: string,
};

export class CreateGroceryList implements RequestDefinition {
  constructor(private database: Database) { }
  httpMethod: HttpMethod = 'put';
  path: string = '/groceryList';
  handler: RequestHandler = (req, res) => {
    const body = req.body as CreateGroceryListBody;
    this.database.run(`
        insert into grocery_list(name, created_at, updated_at)
          values($name, $created_at, $created_at);`,
      {
        $name: body.name,
        $created_at: new Date().toISOString(),
      },
      (error) => {
        if (error) {
          console.trace(error);
          return res.status(500).send(error);
        }
        return res.status(200).send();
      }
    ).run(`
        insert into grocery_list_permission(user_id, grocery_list_id, permission_id)
          values($userId, last_insert_rowid(), 'owner');`,
      {
        $userId: body.owner,
      },
      (error) => {
        if (error) {
          console.trace(error);
          return res.status(500).send(error);
        }
        return res.status(200).send();
      }
    )
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
    this.database.run(
      `delete from grocery_list_permission where grocery_list_id = $id;`,
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
    this.database.all(`
      select gli.id, gli.amount, gli.bought, egi.name, eau.name as unit_name, eau.short_name as unit_short_name
      FROM grocery_list_item gli
      left join enum_grocery_item egi on gli.grocery_item_id = egi.id and egi.locale = $locale
      left join enum_amount_unit eau on gli.amount_unit_id = eau.id and eau.locale = $locale
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
    this.database.run(`
      insert into grocery_list_item(grocery_list_id, grocery_item_id, amount, amount_unit_id) values
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
        this.database.get(`
          select gli.id, egi.name, gli.amount, eau.name as unit_name, eau.short_name as unit_short_name, gli.bought
          FROM grocery_list_item gli
          left join enum_grocery_item egi on gli.grocery_item_id = egi.id and egi.locale = $locale
          left join enum_amount_unit eau on gli.amount_unit_id = eau.id and eau.locale = $locale
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
    this.database.run(`
      update grocery_list_item
      set bought = $bought
      where id = $item_id;`,
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
    this.database.run(`
      delete from grocery_list_item
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


