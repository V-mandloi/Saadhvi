
import clientPromise from "../../../../../lib/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const db = (await clientPromise).db();
    const { email, password } = await req.json();

    const doctor = await db.collection("doctors").findOne({ email });

    if (!doctor) {
      return new Response(JSON.stringify({ error: "Doctor not found" }), { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, doctor.password);

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: "Invalid password" }), { status: 401 });
    }


    const { password: _, ...doctorPayload } = doctor;
    const token = jwt.sign(doctorPayload, process.env.JWT_SECRET, { expiresIn: "7d" });

    return new Response(JSON.stringify({
      message: "Login successful",
      token,
      doctor: doctorPayload
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Doctor Login Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
