import { DataTypes } from 'sequelize';

export function definePost(sequelize) {
  const Post = sequelize.define(
    'Post',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
      },
      excerpt: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
      },
      metaDescription: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      metaKeywords: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING(80),
        allowNull: false,
        defaultValue: 'General',
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      featuredImage: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      imageAlt: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      author: {
        type: DataTypes.STRING(120),
        allowNull: false,
        defaultValue: 'SEO Desk',
      },
      sourceUrl: {
        type: DataTypes.STRING(600),
        allowNull: true,
      },
      readingTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM('published', 'draft'),
        allowNull: false,
        defaultValue: 'published',
      },
    },
    {
      tableName: 'posts',
      timestamps: true,
      indexes: [
        { fields: ['category'] },
        { fields: ['status'] },
        { fields: ['createdAt'] },
      ],
    }
  );

  return Post;
}
