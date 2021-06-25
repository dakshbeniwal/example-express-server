'use strict';

import fs from "fs";
import { Sequelize, DataTypes } from "sequelize";
import config from "../config/config";
import mysql from "mysql2/promise";

const dbConfig = config[config.NODE_ENV || "development"];

class Database {
  public db: any = {};

  constructor() {
    // this.initializeDatabase();
  }

  initializeDatabase = async () => {
    const connection = await mysql.createConnection({ "host": dbConfig.host, "port": dbConfig.port, "user": dbConfig.username, "password": dbConfig.password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);

    const sequelize: Sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

    fs
      .readdirSync(__dirname)
      .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== "index.ts") && (file.slice(-3) === '.ts');
      })
      .forEach(file => {
        const model = require(__dirname + "/" + file)(sequelize, DataTypes);
        this.db[model.name] = model;
      });

    Object.keys(this.db).forEach(modelName => {
      if (this.db[modelName].associate) {
        this.db[modelName].associate(this.db);
      }
      if (this.db[modelName].addTransactions) {
        this.db[modelName].addTransactions(this.db[modelName]);
      }
    });

    await sequelize.sync()
      .then(() => console.log("Database connected..."))
      .catch(err => console.log("Error while connecting to database:", err));

    this.db.sequelize = sequelize;
    this.db.Sequelize = Sequelize;
  }
}

export const dbInstance = new Database();
export const db = dbInstance.db;