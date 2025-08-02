import { NextResponse } from 'next/server';
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from 'mongodb';

/**
 * GET a single referral by its ID with populated data
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db("saadhvi_db");

    const referral = await db.collection("referrals").aggregate([
      // 1. Match the specific referral by ID
      { 
        $match: { _id: ObjectId.createFromHexString(id) } 
      },
      // 2. Join with patients collection
      {
        $lookup: {
          from: "patients",
          localField: "patientId",
          foreignField: "_id",
          as: "patientInfo"
        }
      },
      // 3. Join with hospitals collection
      {
        $lookup: {
          from: "hospitals",
          localField: "hospitalId",
          foreignField: "_id",
          as: "hospitalInfo"
        }
      },
      // 4. Join with packages collection
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "_id",
          as: "packageInfo"
        }
      },
      // Deconstruct the arrays from the lookups
      { $unwind: { path: "$patientInfo", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$hospitalInfo", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$packageInfo", preserveNullAndEmptyArrays: true } },
      // Shape the final output
      {
        $project: {
          status: 1,
          notes: 1,
          createdAt: 1,
          patient: "$patientInfo",
          hospital: "$hospitalInfo",
          package: "$packageInfo",
        }
      }
    ]).next(); // Use .next() because we expect only one result

    if (!referral) {
        return NextResponse.json({ error: "Referral not found" }, { status: 404 });
    }

    return NextResponse.json(referral);

  } catch (error) {
    console.error(`API GET Referral by ID Error for ID ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch referral details' }, { status: 500 });
  }
}


/**
 * UPDATE a referral's status
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { status } = await request.json();

    if (!status) {
        return NextResponse.json({ error: "Status is required." }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("saadhvi_db");

    const result = await db.collection("referrals").updateOne(
        { _id: ObjectId.createFromHexString(id) },
        { $set: { status: status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Referral not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Referral status updated successfully" }, { status: 200 });

  } catch (error) {
    console.error(`API PUT Referral Error for ID ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to update referral' }, { status: 500 });
  }
}
