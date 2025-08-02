import { NextResponse } from 'next/server';
import clientPromise from "../../../../../lib/mongodb";
import User from "../../models/User";

export async function POST(request) {
  try {
    await clientPromise;
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // In a real app, you would generate a JWT (JSON Web Token) here.
    // For now, we will just return a success message.
    return NextResponse.json({ message: "Login successful!", user: { email: user.email, role: user.role } });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: 'Failed to log in' }, { status: 500 });
  }
}