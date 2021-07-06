import { Model, Sequelize } from "sequelize";

export interface IUsers {
  "id": number,
  "firstname": string,
  "lastname": string,
  "email": string,
  "phone"?: string,
  "password"?: string,
  "username": string,
  "googleId"?: string,
  "emailVerified": boolean
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: Model) {
      // define association here
    }
  };
  Users.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    googleId: DataTypes.STRING,
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'users',
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "name",
        using: "BTREE",
        fields: [
          { name: "firstname" },
          { name: "lastname" },
        ]
      },
      {
        name: "login",
        using: "BTREE",
        fields: [
          { name: "email" },
          { name: "username" }
        ]
      },
    ]
  });
  return Users;
};