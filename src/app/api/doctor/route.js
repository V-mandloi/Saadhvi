// /app/api/doctor/route.js
import clientPromise from "../../../../lib/mongodb";
import bcrypt from "bcrypt";

// POST: Register a doctor with hashed password
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const {
      name,
      specialization,
      experience,
      contact,
      email,
      hospital,
      password
    } = await req.json();

    // Check if doctor already exists
    const existing = await db.collection("doctors").findOne({ email });
    if (existing) {
      return new Response(JSON.stringify({ error: "Doctor already exists" }), {
        status: 409
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert doctor
    const result = await db.collection("doctors").insertOne({
      name,
      specialization,
      experience,
      contact,
      email,
      hospital,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return new Response(JSON.stringify({
      message: "Doctor registered successfully",
      doctorId: result.insertedId
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("POST /doctor error:", error);
    return new Response(JSON.stringify({ error: "Doctor registration failed" }), {
      status: 500
    });
  }
}

// GET: Fetch all doctors
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const doctors = await db.collection("doctors").find().toArray();

    return new Response(JSON.stringify(doctors), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("GET /doctor error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch doctors" }), {
      status: 500
    });
  }
}
