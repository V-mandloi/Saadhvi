import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb.js';
 // Corrected path to lib

/**
 * @param {import('next/server').NextRequest} req
 */
export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("saadhvi_db"); // Use the same DB name as your hospital route

    const patients = await db
      .collection("patients") // Use the collection name (usually plural and lowercase)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(patients, { status: 200 });
  } catch (err) {
    console.error("GET Patients Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * @param {import('next/server').NextRequest} req
 */
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("saadhvi_db");
    const collection = db.collection("patients");

    const data = await req.json();

    // Basic validation
    if (!data.name || !data.age || !data.gender || !data.contact.phone) {
        return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    
    const patientToInsert = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    await collection.insertOne(patientToInsert);

    return NextResponse.json({ message: "Patient created successfully!", patient: patientToInsert }, {
        status: 201
    });

  } catch (err) {
    console.error("POST Patient Error:", err);
    return NextResponse.json({ error: "Bad request. Please check your data." }, { status: 400 });
  }
}