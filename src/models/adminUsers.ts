import { Model, Sequelize } from "sequelize";

export interface IAdminUsers {
    "id": number,
    "firstname": string,
    "lastname": string,
    "email": string,
    "phone": string,
    "password": string,
    "lastSignIn": Date,
    "currentSignIn": Date,
    "lastSignInIP": string,
    "currentSignInIP": string,
    "failedAttempts": number
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
    class AdminUsers extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: Model) {
            // define association here
        }
    };
    AdminUsers.init({
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
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastSignIn: DataTypes.DATE,
        currentSignIn: DataTypes.DATE,
        lastSignInIP: DataTypes.STRING,
        currentSignInIP: DataTypes.STRING,
        failedAttempts: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'adminUsers',
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
                name: "login",
                using: "BTREE",
                fields: [
                    { name: "email" }
                ]
            },
        ]
    });
    return AdminUsers;
};