import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import User from "../../models/User";
import Doctor from "../../models/doctor";
import Hospital from "../../models/hospital";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { role, email, password } = body;

    if (!role || !email || !password) {
      return NextResponse.json({ error: "Role, email, and password are required." }, { status: 400 });
    }

    let existingUser;
    let newUser;
    const hashedPassword = await bcrypt.hash(password, 10);

    switch (role) {
      case 'Doctor':
        existingUser = await Doctor.findOne({ email });
        if (existingUser) {
          return NextResponse.json({ error: "Doctor with this email already exists." }, { status: 400 });
        }
        newUser = new Doctor({ ...body, password: hashedPassword, role: 'Doctor' });
        break;
      case 'Hospital':
        existingUser = await Hospital.findOne({ email });
        if (existingUser) {
          return NextResponse.json({ error: "Hospital with this email already exists." }, { status: 400 });
        }
        newUser = new Hospital({ ...body, password: hashedPassword, role: 'Hospital' });
        break;
      case 'PRO':
        existingUser = await User.findOne({ email });
        if (existingUser) {
          return NextResponse.json({ error: "PRO with this email already exists." }, { status: 400 });
        }
        // Assuming User model has a pre-save hook for password hashing
        newUser = new User({ ...body, password, role: 'PRO' });
        break;
      default:
         return NextResponse.json({ error: "Invalid role specified." }, { status: 400 });
    }

    await newUser.save();

    return NextResponse.json({ message: `${role} registered successfully!` }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
  }
}