import { DataTypes, Model, Optional, Sequelize } from "sequelize";

type GroceryListAttributes = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type GroceryListCreationAttributes = GroceryListAttributes;

export class GroceryList extends Model<GroceryListAttributes, GroceryListCreationAttributes> {
  declare id: number;
  declare grocery_item_id: string;
  declare createdAt: string;
  declare updatedAt: string;
}

export function InitColumns(sequelize: Sequelize) {
  GroceryList.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    { sequelize },
  );
}

export function InitAssociations() {

}
