import sequelize from "@/lib/server/db";
import { User } from "@/models";
import bcrypt from "bcryptjs";
// adjust path if needed

async function createAdmin() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    const email = "admin@campaign.com";
    const password = "admin123"; // change after first login

    // Check if user already exists
    const existing = await User.findOne({ where: { email } });

    if (existing) {
      console.log("⚠️ Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: "Admin",
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("🎉 Admin user created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
