import express from 'express'
import dotenv from 'dotenv'
import { CreateUser, GetUser } from './requests/userRequests';
import { Database } from 'sqlite3';
import { RequestDefinition } from './interfaces/method';
import { AddItemToGroceryList, CreateGroceryList, DeleteGroceryList, DeleteGroceryListItem as DeleteGroceryListItem, GetGroceryListItem, GetUserGroceryList, GetUserGroceryLists, UpdateGroceryList, UpdateGroceryListItemBoughtStatus } from './requests/groceryListRequests';
import { GetUnits } from './requests/unitsRequests';
import { GetGroceryItems } from './requests/groceryItemsRequests';
import { GetRecipes } from './requests/recipeRequests';

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
      const app = express();
      app.use(express.json())
      const requests: RequestDefinition[] = [
        new GetUser(database),
        new CreateUser(database),
        new GetUserGroceryLists(database),
        new GetUserGroceryList(database),
        new CreateGroceryList(database),
        new UpdateGroceryList(database),
        new DeleteGroceryList(database),
        new GetGroceryListItem(database),
        new UpdateGroceryListItemBoughtStatus(database),
        new AddItemToGroceryList(database),
        new DeleteGroceryListItem(database),
        new GetUnits(database),
        new GetGroceryItems(database),
        new GetRecipes(database),
      ];
      console.log(`Registering requests:`)
      requests.forEach((req) => {
        app[req.httpMethod](req.path, req.handler);
        console.log(`${req.httpMethod.toUpperCase()}: ${req.path}`)
      })

      app.listen(process.env.PORT);
      console.log(`Started at PORT=${process.env.PORT} with ENV=${process.env.NODE_ENV}`)
    });
  });
})();


