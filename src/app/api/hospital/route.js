// src/app/api/hospital/route.js

import { NextResponse } from 'next/server';
import clientPromise from "../../../../lib/mongodb";
import bcrypt from "bcrypt";

// GET all hospitals
export async function GET() {
  try {
    const client = await clientPromise;
    // highlight-start
    const db = client.db("saadhvi_db"); 
    // highlight-end

    const hospitals = await db
      .collection("hospitals")
      .find({})
      .project({ password: 0 }) 
      .toArray();

    return NextResponse.json(hospitals);
  } catch (error) {
    console.error("API GET Error:", error);
    return NextResponse.json({ error: 'Failed to fetch hospitals' }, { status: 500 });
  }
}

// CREATE a new hospital
export async function POST(request) {
  try {
    const client = await clientPromise;
    // highlight-start
    const db = client.db("saadhvi_db"); 
    // highlight-end
    const collection = db.collection("hospitals");

    const data = await request.json();
    const { email, password, name, registrationNumber } = data;

    // Check if required fields are present
    if (!email || !password || !name || !registrationNumber) {
        return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Check if hospital already exists
    const existingHospital = await collection.findOne({ email });
    if (existingHospital) {
      return NextResponse.json({ error: "Hospital with this email already exists." }, { status: 400 });
    }

    // Manually hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare data for insertion
    const hospitalToInsert = {
      ...data,
      password: hashedPassword, // Replace plain password with hashed password
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(hospitalToInsert);
    
    // Don't send back the password in the response
    delete hospitalToInsert.password;

    return NextResponse.json({ message: "Hospital Registered Successfully!", hospital: hospitalToInsert }, { status: 201 });
  } catch (error) {
    console.error("API POST Error:", error);
    return NextResponse.json({ error: 'Failed to create hospital' }, { status: 500 });
  }
}