import { NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb'; // Important: Import ObjectId


/**
 * @param {import('next/server').NextRequest} req
 * @param {{ params: { id: string } }} context
 */
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    const client = await clientPromise;
    const db = client.db("saadhvi_db");

    const result = await db.collection("patients").deleteOne({
      _id: new ObjectId(id) // Use ObjectId to convert the string ID
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Patient deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("DELETE Patient Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * @param {import('next/server').NextRequest} req
 * @param {{ params: { id: string } }} context
 */
export async function PUT(req, { params }) {
    try {
        const { id } = params;
        const data = await req.json();
        
        // Remove the _id from the data object if it exists to prevent errors
        delete data._id; 

        const client = await clientPromise;
        const db = client.db("saadhvi_db");

        // Add updatedAt timestamp
        const updateData = {
          $set: {
            ...data,
            updatedAt: new Date()
          }
        };

        const result = await db.collection("patients").updateOne(
          { _id: new ObjectId(id) }, // Use ObjectId to find the document
          updateData
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Patient updated successfully" }, { status: 200 });
    } catch (err) {
        console.error("PUT Patient Error:", err);
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }
}