import clientPromise from "../../../../lib/mongodb"; // Adjust path if needed
import { ObjectId } from "mongodb";

/**
 * @param {import('next/server').NextRequest} req
 */
export async function GET(req) {
  try {
    const db = (await clientPromise).db();
    const packages = await db.collection("packages").aggregate([
      {
        $lookup: {
          from: "hospitals",
          localField: "hospital",
          foreignField: "_id",
          as: "hospitalInfo",
        },
      },
      {
        $unwind: {
          path: "$hospitalInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: 1,
          price: 1,
          services: 1,
          hospital: {
            _id: "$hospitalInfo._id",
            name: "$hospitalInfo.name",
          },
        },
      },
    ]).toArray();

    return new Response(JSON.stringify(packages), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GET Packages Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

/**
 * @param {import('next/server').NextRequest} req
 */
export async function POST(req) {
  try {
    const db = (await clientPromise).db();
    const data = await req.json();

    if (!data.hospital || !ObjectId.isValid(data.hospital)) {
      return new Response(JSON.stringify({ error: "Valid Hospital ID is missing or invalid." }), { status: 400 });
    }

    const hospitalId = new ObjectId(data.hospital);
    const hospitalExists = await db.collection("hospitals").findOne({ _id: hospitalId });

    if (!hospitalExists) {
      return new Response(JSON.stringify({ error: "Cannot create package. Hospital not found." }), { status: 404 });
    }

    const newPackage = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      services: data.services,
      hospital: hospitalId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("packages").insertOne(newPackage);

    return new Response(JSON.stringify({ message: "Package created successfully!" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("POST Package Error:", err);
    return new Response(JSON.stringify({ error: "Bad request. Please check your data." }), { status: 400 });
  }
}