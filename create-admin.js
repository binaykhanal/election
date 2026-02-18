import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "./src/lib/server/db.js";
import { User } from "./src/models/index.js";

async function createAdmin() {
  try {
    await connectDB();
    console.log(" Database connected");

    const email = process.env.ADMIN_EMAIL || "admin@campaign.com";
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const name = process.env.ADMIN_NAME || "Admin";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`  User with email "${email}" already exists.`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
    });

    console.log("Admin user created successfully:");
    console.log(`Name: ${adminUser.name}`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Role: ${adminUser.role}`);

    process.exit(0);
  } catch (error) {
    console.error(" Failed to create admin user:", error);
    process.exit(1);
  }
}

createAdmin();
