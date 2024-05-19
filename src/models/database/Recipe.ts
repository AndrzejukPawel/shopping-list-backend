import { DataTypes, Model, Optional, Sequelize } from "sequelize";

type RecipeAttributes = {
  id: number;
  locale: string;
  name: string;
  description: string;
};

type RecipeCreationAttributes = Optional<RecipeAttributes, 'id'>;

export class Recipe extends Model<RecipeAttributes, RecipeCreationAttributes> {
  declare id: number;
  declare locale: string;
  declare name: string;
  declare description: string;
}

export function InitColumns(sequelize: Sequelize) {
  Recipe.init(
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
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    { sequelize },
  );
}

export function InitAssociations() {

}
