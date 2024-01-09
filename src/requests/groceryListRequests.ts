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

export class CreateGroceryList implements RequestDefinition {
    constructor(private database: Database) { }
    httpMethod: HttpMethod = 'put';
    path: string = '/groceryList';
    handler: RequestHandler = (req, res) => {
        const user = req.body as GroceryList;
        this.database.run(
            `insert into grocery_list(name, created_at, updated_at) 
            values($id, $created_at, $created_at); `,
            {
                $name: user.name,
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

export class GetGroceryListItems implements RequestDefinition {
    constructor(private database: Database) { }
    httpMethod: HttpMethod = 'get';
    path: string = '/groceryList/:listId/item';
    handler: RequestHandler = (req, res) => {
        const listId = req.params.listId;
        console.log(listId);
        this.database.all(
            `select * from grocery_list_item where grocery_list_id = $list_id;`,
            {
                $list_id: listId,
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


