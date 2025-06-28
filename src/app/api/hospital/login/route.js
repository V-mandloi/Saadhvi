import clientPromise from "../../../../../lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const db = (await clientPromise).db();
    const { email, password } = await req.json();

    const hospital = await db.collection("hospitals").findOne({ email });

    if (!hospital) {
      return new Response(JSON.stringify({ error: "Hospital not found" }), { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, hospital.password);

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: "Invalid password" }), { status: 401 });
    }

    // Success: Return minimal data (never return password)
    return new Response(JSON.stringify({
      message: "Login successful",
      hospitalId: hospital._id,
      name: hospital.name
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Login error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
