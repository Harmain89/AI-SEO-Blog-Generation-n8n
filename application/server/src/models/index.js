import { sequelize } from '../config/database.js';
import { definePost } from './post.model.js';

const Post = definePost(sequelize);

export const db = { sequelize, Post };
export { sequelize, Post };
