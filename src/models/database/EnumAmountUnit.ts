import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { EnumGroceryItem } from "./EnumGroceryItem";

type EnumAmountUnitAttributes = {
  id: number;
  locale: string;
  name: string;
  shortName: string;
};

type EnumAmountUnitCreationAttributes = Optional<EnumAmountUnitAttributes, 'id'>;

export class EnumAmountUnit extends Model<EnumAmountUnitAttributes, EnumAmountUnitCreationAttributes> {
  declare id: number;
  declare locale: string;
  declare name: string;
  declare shortName: string;
}

export function InitColumns(sequelize: Sequelize) {
  EnumAmountUnit.init(
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
      shortName: {
        type: DataTypes.TEXT,
        allowNull: false,
      }
    },
    { sequelize },
  );
}

export function InitAssociations() {

}
