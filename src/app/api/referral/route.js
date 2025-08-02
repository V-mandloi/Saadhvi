import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';


/**
 * GET all referrals with populated data
 */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("saadhvi_db");

    const referrals = await db.collection("referrals").aggregate([
      // 1. Join with patients collection
      {
        $lookup: {
          from: "patients",
          localField: "patientId",
          foreignField: "_id",
          as: "patient"
        }
      },
      // 2. Join with hospitals collection
      {
        $lookup: {
          from: "hospitals",
          localField: "hospitalId",
          foreignField: "_id",
          as: "hospital"
        }
      },
      // 3. Join with packages collection
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "_id",
          as: "package"
        }
      },
      // Deconstruct the arrays from the lookups
      { $unwind: { path: "$patient", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$hospital", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$package", preserveNullAndEmptyArrays: true } },
      // Shape the final output
      {
        $project: {
          status: 1,
          notes: 1,
          createdAt: 1,
          patient: { _id: "$patient._id", name: "$patient.name" },
          hospital: { _id: "$hospital._id", name: "$hospital.name" },
          package: { _id: "$package._id", name: "$package.name" },
        }
      },
      { $sort: { createdAt: -1 } }
    ]).toArray();

    return NextResponse.json(referrals);
  } catch (error) {
    console.error("API GET Referrals Error:", error);
    return NextResponse.json({ error: 'Failed to fetch referrals' }, { status: 500 });
  }
}

/**
 * CREATE a new referral
 */
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("saadhvi_db");
    
    const data = await request.json();
    const { patientId, hospitalId, packageId, notes } = data;

    if (!patientId || !hospitalId || !packageId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const referralToInsert = {
      patientId: new ObjectId(patientId),
      hospitalId: new ObjectId(hospitalId),
      packageId: new ObjectId(packageId),
      notes: notes || '',
      status: "Pending", // Default status
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("referrals").insertOne(referralToInsert);

    return NextResponse.json({ message: "Referral Created Successfully!", referralId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("API POST Referral Error:", error);
    return NextResponse.json({ error: 'Failed to create referral' }, { status: 500 });
  }
}