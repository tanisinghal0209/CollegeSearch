import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsedData = registerSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsedData.error.issues },
        { status: 400 }
      );
    }

    const { name, email, password } = parsedData.data;

    const existingUser = await db.user.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      name,
      email,
      passwordHash
    });

    return NextResponse.json({
      success: true,
      data: { id: newUser.id, name: newUser.name, email: newUser.email }
    }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create account" },
      { status: 500 }
    );
  }
}
