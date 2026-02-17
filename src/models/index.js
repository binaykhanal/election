import { DataTypes } from "sequelize";
import sequelize from "../lib/server/db";

export const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("ADMIN", "EDITOR"),
      defaultValue: "EDITOR",
    },
  },
  { tableName: "users" },
);

export const Blog = sequelize.define(
  "Blog",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    titleEn: { type: DataTypes.STRING, field: "title_en" },
    titleNp: { type: DataTypes.STRING, field: "title_np" },
    slug: { type: DataTypes.STRING, unique: true },
    contentEn: { type: DataTypes.TEXT, field: "content_en" },
    contentNp: { type: DataTypes.TEXT, field: "content_np" },
    excerptEn: { type: DataTypes.STRING, field: "excerpt_en" },
    excerptNp: { type: DataTypes.STRING, field: "excerpt_np" },
    featuredImage: { type: DataTypes.STRING, field: "featured_image" },
    published: { type: DataTypes.BOOLEAN, defaultValue: false },
    publishedAt: { type: DataTypes.DATE, field: "published_at" },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { tableName: "blogs" },
);

export const Inquiry = sequelize.define(
  "Inquiry",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    subject: { type: DataTypes.STRING },
    message: { type: DataTypes.TEXT, allowNull: false },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: "inquiries" },
);

export const Content = sequelize.define(
  "Content",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    page: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "home",
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        "HERO",
        "ABOUT",
        "VISION",
        "EXPERIENCE",
        "CONTACT",
        "MANIFESTO",
        "RICH_TEXT",
        "STATS",
        "ABOUT_META",
        "JSON_LIST",
        "VISION_BUILDER",
        "EXPERIENCE_EDITOR",
        "SETTINGS",
        "SOCIAL",
      ),
      defaultValue: "RICH_TEXT",
    },
    valueEn: { type: DataTypes.TEXT, field: "value_en" },
    valueNp: { type: DataTypes.TEXT, field: "value_np" },
  },
  {
    tableName: "contents",
    indexes: [{ unique: true, fields: ["page", "key"] }],
  },
);
