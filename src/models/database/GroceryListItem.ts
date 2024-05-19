import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { EnumAmountUnit } from "./EnumAmountUnit";

type GroceryListItemAttributes = {
  id: number;
  locale: string;
  name: string;
};

type GroceryListItemCreationAttributes = Optional<GroceryListItemAttributes, 'id'>;

export class GroceryListItem extends Model<GroceryListItemAttributes, GroceryListItemCreationAttributes> {
  declare id: number;
  declare locale: string;
  declare name: string;
}

export function InitColumns(sequelize: Sequelize) {
  GroceryListItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      locale: {
        type: DataTypes.TEXT,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    { sequelize },
  );
}

export function InitAssociations() {
  GroceryListItem.belongsTo(EnumAmountUnit);
}
