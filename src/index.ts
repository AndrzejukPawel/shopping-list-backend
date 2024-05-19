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
import { DataTypes, Model, Sequelize } from 'sequelize';
import * as User from './models/database/User';
import * as GroceryList from './models/database/GroceryList';
import * as GroceryListPermission from './models/database/GroceryListPermission';
import * as EnumPermission from './models/database/EnumPermission';
import * as EnumAmountUnit from './models/database/EnumAmountUnit';
import * as EnumGroceryItem from './models/database/EnumGroceryItem';
import * as GroceryListItem from './models/database/GroceryListItem';
import * as Recipe from './models/database/Recipe';
import * as RecipeIngredient from './models/database/RecipeIngredient';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

function sequelizeSetup() {
  return new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DATABASE,
    define: {
      freezeTableName: true,
    }
  });
}

function initializeDatabaseModels(sequelize: Sequelize) {

  const models = [
    EnumAmountUnit,
    EnumGroceryItem,
    EnumPermission,
    GroceryList,
    GroceryListItem,
    GroceryListPermission,
    Recipe,
    RecipeIngredient,
    User,
  ];

  for (const model of models) {
    model.InitColumns(sequelize);
  }

  for (const model of models) {
    model?.InitAssociations();
  }
}

function onClose(sequelize: Sequelize) {
  sequelize.close();
  console.log("Stopping...")
}

function initializeRequestHandlers(app: express.Express) {
  const requests: Request[] = [
    // new GetUser(database),
    // new CreateUser(database),
    // new GetUserGroceryLists(database),
    // new CreateGroceryList(database),
    // new DeleteGroceryList(database),
    // new GetGroceryListItem(database),
    // new UpdateGroceryListItemBoughtStatus(database),
    // new AddItemToGroceryList(database),
    // new DeleteGroceryListItem(database),
    // new GetUnits(database),
    // new GetGroceryItems(database),
    // new GetRecipes(database),
    // new CreateRecipe(database),
  ];

  console.log(`Registering requests:`)
  for (var request of requests) {
    app[request.httpMethod](request.path, (req, res) => {
      console.log(`${req.method} ${req.url} ${JSON.stringify(req.body)}`);
      return request.handler(req, res, () => { });
    });
    console.log(`${request.httpMethod.toUpperCase()}: ${request.path}`)
  }
}

async function run() {
  if (!process.env.DATABASE) {
    return console.error('Missing ENV variable DATABASE!');
  }

  const sequelize = sequelizeSetup();
  initializeDatabaseModels(sequelize);
  await sequelize.sync({ force: true });

  console.log(`Connected to ${process.env.DATABASE} database`);

  const app = express();
  initializeRequestHandlers(app);
  app.use(express.json())
    .listen(process.env.PORT).on("close", () => onClose(sequelize));
  process.on("SIGINT", () => onClose(sequelize));

  console.log(`Started in ${__dirname} at PORT=${process.env.PORT} with ENV=${process.env.NODE_ENV}`);
}

run();


