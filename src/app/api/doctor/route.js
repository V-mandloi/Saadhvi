import clientPromise from "../../../../lib/mongodb";
import bcrypt from "bcrypt";

// POST: Register a doctor with hashed password
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const body = await req.json();

    const {
      name,
      specialization,
      experience,
      contact,
      email,
      hospital,
      password
    } = body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection("doctors").insertOne({
      name,
      specialization,
      experience,
      contact,
      email,
      hospital,
      password: hashedPassword,
      createdAt: new Date()
    });

    return new Response(JSON.stringify({
      message: "Doctor Registered Successfully",
      doctorId: result.insertedId
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Doctor Registration Error:", error);
    return new Response(JSON.stringify({ error: "Doctor registration failed" }), {
      status: 500
    });
  }
}

// GET: Fetch all doctors
export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const doctors = await db.collection("doctors").find().toArray();

    return new Response(JSON.stringify(doctors), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error("Fetch Doctors Error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch doctors" }), {
      status: 500
    });
  }
}
