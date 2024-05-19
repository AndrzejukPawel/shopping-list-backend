import { DataTypes, Model, Optional, Sequelize } from "sequelize";

type EnumPermissionAttributes = {
  id: number;
  permission: string;
};

type EnumPermissionCreationAttributes = Optional<EnumPermissionAttributes, 'id'>;

export class EnumPermission extends Model<EnumPermissionAttributes, EnumPermissionCreationAttributes> {
  declare id: number;
  declare permission: string;
}

export function InitColumns(sequelize: Sequelize) {
  EnumPermission.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      permission: {
        type: DataTypes.TEXT,
        allowNull: false,
      }
    },
    { sequelize },
  );
}

export function InitAssociations() {

}
