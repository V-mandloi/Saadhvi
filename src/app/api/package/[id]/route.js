import clientPromise from "../../../../../lib/mongodb"; // Adjust path if needed
import { ObjectId } from "mongodb";

/**
 * @param {import('next/server').NextRequest} req
 * @param {{ params: { id: string } }} context
 */
export async function DELETE(req, { params }) {
  try {
    const db = (await clientPromise).db();
    const packageId = new ObjectId(params.id);
    const result = await db.collection("packages").deleteOne({ _id: packageId });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Package not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Package deleted successfully" }), { status: 200 });
  } catch (err) {
    console.error("DELETE Package Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

/**
 * @param {import('next/server').NextRequest} req
 * @param {{ params: { id: string } }} context
 */
export async function PUT(req, { params }) {
    try {
        const db = (await clientPromise).db();
        const packageId = new ObjectId(params.id);
        const data = await req.json();
        const updateData = { ...data, updatedAt: new Date() };

        if (updateData.hospital) {
            updateData.hospital = new ObjectId(updateData.hospital);
        }

        const result = await db.collection("packages").updateOne({ _id: packageId }, { $set: updateData });

        if (result.matchedCount === 0) {
            return new Response(JSON.stringify({ error: "Package not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Package updated successfully" }), { status: 200 });
    } catch (err) {
        console.error("PUT Package Error:", err);
        return new Response(JSON.stringify({ error: "Bad request" }), { status: 400 });
    }
}