import clientPromise from "../../../../lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const body = await req.json();
 

    const {
      name,
      specialization,
      registrationNumber,
      contact,
      email,
      address,
      password
    } = body;
  
     const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection("hospitals").insertOne({
      name,
      specialization,
      registrationNumber,
      contact,
      email,
      address,
      password : hashedPassword,
      createdAt: new Date()
    });

    return new Response(JSON.stringify({
      message: "Hospital Registered Successfully",
      hospitalId: result.insertedId
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Hospital Registration Error:", error);
    return new Response(JSON.stringify({ error: "Hospital registration failed" }), {
      status: 500
    });
  }
}

// ✅ GET Request: Fetch all hospitals
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const hospitals = await db.collection("hospitals").find().toArray();

    return new Response(JSON.stringify(hospitals), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Fetch Hospitals Error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch hospitals" }), {
      status: 500
    });
  }
}
