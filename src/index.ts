import express from 'express'
import dotenv from 'dotenv'
import { CreateUser, GetUser } from './requests/userRequests';
import { Database } from 'sqlite3';
import { Request } from './interfaces/Request';
import {
  AddItemToGroceryList,
  CreateGroceryList,
  DeleteGroceryList,
  DeleteGroceryListItem,
  GetGroceryListItem,
  GetUserGroceryLists,
  UpdateGroceryListItemBoughtStatus
} from './requests/groceryListRequests';
import { GetUnits } from './requests/unitsRequests';
import { GetGroceryItems } from './requests/groceryItemsRequests';
import { CreateRecipe, GetRecipes } from './requests/recipeRequests';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
//console.log(Object.getOwnPropertyNames(process.env).forEach(prop => { console.log(`${prop} = ${process.env[prop]}`) }));
(() => {
  if (!process.env.DB_PATH) {
    console.error('Missing ENV variable DB_PATH!');
    return;
  }
  //console.log(process.env.DB_PATH);
  const database = new Database(process.env.DB_PATH, (err) => {
    if (err) console.error(`Database connection error!${err ? `\n${err}` : ''}`);

    console.log(`Connected to ${process.env.DB_PATH} database`);

    database.serialize(() => {
      const app = express()
        .use(express.json());
      const requests: Request[] = [
        new GetUser(database),
        new CreateUser(database),
        new GetUserGroceryLists(database),
        new CreateGroceryList(database),
        new DeleteGroceryList(database),
        new GetGroceryListItem(database),
        new UpdateGroceryListItemBoughtStatus(database),
        new AddItemToGroceryList(database),
        new DeleteGroceryListItem(database),
        new GetUnits(database),
        new GetGroceryItems(database),
        new GetRecipes(database),
        new CreateRecipe(database),
      ];
      console.log(`Registering requests:`)
      requests.forEach((reqDef) => {
        app[reqDef.httpMethod](reqDef.path, (req, res) => {
          console.log(`${req.method} ${req.url} ${JSON.stringify(req.body)}`);
          return reqDef.handler(req, res, () => { });
        });
        console.log(`${reqDef.httpMethod.toUpperCase()}: ${reqDef.path}`)
      })

      app.listen(process.env.PORT);
      console.log(`Started at PORT=${process.env.PORT} with ENV=${process.env.NODE_ENV}`)
    });
  });
})();


