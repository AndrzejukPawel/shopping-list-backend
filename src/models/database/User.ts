import { DataTypes, Model, Optional, Sequelize } from "sequelize";

type UserAttributes = {
  id: string;
  name: string;
};

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

export class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: string;
  declare name: string;
}

export function InitColumns(sequelize: Sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.TEXT,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      }
    },
    { sequelize },
  );
}

export function InitAssociations() {

}
