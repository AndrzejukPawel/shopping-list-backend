import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { User } from "./User";
import { GroceryList } from "./GroceryList";
import { EnumPermission } from "./EnumPermission";

type GroceryListPermissionAttributes = {};

type GroceryListPermissionCreationAttributes = GroceryListPermissionAttributes;

export class GroceryListPermission extends Model<GroceryListPermissionAttributes, GroceryListPermissionCreationAttributes> { }

export function InitColumns(sequelize: Sequelize) {
  GroceryListPermission.init(
    {
    },
    { sequelize },
  );
}

export function InitAssociations() {
  User.hasMany(GroceryListPermission);
  GroceryList.hasMany(GroceryListPermission);
  EnumPermission.hasMany(GroceryListPermission);
}
