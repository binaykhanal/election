import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "EDITOR"],
      default: "EDITOR",
    },
  },
  { timestamps: true },
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);

const blogSchema = new mongoose.Schema(
  {
    titleEn: String,
    titleNp: String,

    slug: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    contentEn: String,
    contentNp: String,

    excerptEn: String,
    excerptNp: String,

    featuredImage: String,

    published: {
      type: Boolean,
      default: false,
    },

    publishedAt: Date,

    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    subject: String,

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Inquiry =
  mongoose.models.Inquiry || mongoose.model("Inquiry", inquirySchema);

const contentSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      default: "home",
      required: true,
    },

    key: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
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
      ],
      default: "RICH_TEXT",
    },

    valueEn: String,
    valueNp: String,
  },
  { timestamps: true },
);

contentSchema.index({ page: 1, key: 1 }, { unique: true });

export const Content =
  mongoose.models.Content || mongoose.model("Content", contentSchema);
