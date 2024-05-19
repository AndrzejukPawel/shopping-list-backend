import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { EnumAmountUnit } from "./EnumAmountUnit";

type EnumGroceryItemAttributes = {
  id: number;
  locale: string;
  name: string;
};

type EnumGroceryItemCreationAttributes = Optional<EnumGroceryItemAttributes, 'id'>;

export class EnumGroceryItem extends Model<EnumGroceryItemAttributes, EnumGroceryItemCreationAttributes> {
  declare id: number;
  declare locale: string;
  declare name: string;
}

export function InitColumns(sequelize: Sequelize) {
  EnumGroceryItem.init(
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
  EnumGroceryItem.belongsTo(EnumAmountUnit);
}
