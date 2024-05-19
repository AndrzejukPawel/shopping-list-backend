import { DataTypes, Model, Optional, Sequelize } from "sequelize";

type RecipeIngredientAttributes = {
  recipe_id: number;
  grocery_item_id: number;
  amount: number;
};

type RecipeIngredientCreationAttributes = RecipeIngredientAttributes;

export class RecipeIngredient extends Model<RecipeIngredientAttributes, RecipeIngredientCreationAttributes> {
  declare recipe_id: number;
  declare grocery_item_id: number;
  declare amount: number;
}

export function InitColumns(sequelize: Sequelize) {
  RecipeIngredient.init(
    {
      recipe_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      grocery_item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { sequelize },
  );
}

export function InitAssociations() {

}
