import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import SequelizeAdapter from "@auth/sequelize-adapter";
import sequelize from "@/lib/server/db.js";
import bcrypt from "bcryptjs";
import authConfig from "../../../../auth.config.js";
import { User } from "../../../../models/index.js";

const handler = NextAuth({
  adapter: SequelizeAdapter(sequelize),
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await User.findOne({
          where: { email: credentials.email },
          attributes: ["id", "name", "email", "password", "role"],
          raw: true,nano
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});

export const GET = handler;
export const POST = handler;
