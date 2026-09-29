import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_NAME = 'automated_seo_blog_db',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_DIALECT = 'mysql',
} = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: DB_DIALECT,
  logging: false,
  define: {
    // camelCase attributes -> snake_case columns are avoided; keep as-is for simplicity
    freezeTableName: false,
  },
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
});

export async function connectDatabase() {
  await sequelize.authenticate();
  return sequelize;
}
