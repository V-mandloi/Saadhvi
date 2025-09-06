import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import User from '../../models/User';
import Doctor from '../../models/doctor';
import Hospital from '../../models/hospital';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    let user = null;
    let userRole = null;
    let isMatch = false;

    // Step 1: Check for a PRO user
    const proUser = await User.findOne({ email }).lean(); // .lean() gives a plain object, faster for reads
    if (proUser) {
      isMatch = await bcrypt.compare(password, proUser.password);
      if (isMatch) {
        user = proUser;
        userRole = 'PRO';
      }
    }

    // Step 2: If not a PRO, check for a Doctor
    if (!user) {
      const doctorUser = await Doctor.findOne({ email }).lean();
      if (doctorUser && doctorUser.password) { // Check if user and password field exist
        isMatch = await bcrypt.compare(password, doctorUser.password);
        if (isMatch) {
          user = doctorUser;
          userRole = 'Doctor';
        }
      }
    }

    // Step 3: If not a Doctor, check for a Hospital
    if (!user) {
      const hospitalUser = await Hospital.findOne({ email }).lean();
      if (hospitalUser && hospitalUser.password) { // Check if user and password field exist
        isMatch = await bcrypt.compare(password, hospitalUser.password);
        if (isMatch) {
          user = hospitalUser;
          userRole = 'Hospital';
        }
      }
    }

    // Step 4: Validate the result
    if (!user) {
      console.log(`Login failed for email: ${email}. User not found or password mismatch.`);
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Step 5: Prepare and send the response
    delete user.password; // IMPORTANT: Remove password before sending
    const userToSend = { ...user, role: userRole };

    return NextResponse.json({
      message: "Login successful!",
      user: userToSend,
    });

  } catch (error) {
    // This will catch any unexpected crashes
    console.error("Login API Unhandled Error:", error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}