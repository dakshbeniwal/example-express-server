'use strict';

export default {
  up: async (queryInterface, DataTypes) => await queryInterface.createTable('adminUsers', {
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
    failedAttempts: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }),
  down: async (queryInterface) => await queryInterface.dropTable('adminUsers')
};
