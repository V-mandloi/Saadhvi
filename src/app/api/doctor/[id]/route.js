import { ObjectId } from "mongodb";
import clientPromise from "../../../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    const updates = await req.json();

    // ❌ Remove _id if present in body
    if ('_id' in updates) {
      delete updates._id;
    }

    // Optional: Remove password if you’re not updating it
    if ('password' in updates) {
      delete updates.password;
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("doctors").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Doctor updated successfully" });
  } catch (err) {
    console.error("PUT /doctor/[id] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// DELETE: Delete doctor
export async function DELETE(req, { params }) {
  const { id } = params;
  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection("doctors").deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Doctor deleted successfully" });
}
