import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db(); // Uses default DB from your MongoDB URI

    const body = await req.json();

    const {
      name,
      specialization,
      registrationNumber,
      contact,
      email,
      address
    } = body;

    const result = await db.collection("hospitals").insertOne({
      name,
      specialization,
      registrationNumber,
      contact,
      email,
      address,
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
