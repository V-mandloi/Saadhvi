
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";


export async function GET(req, { params }) {
  try {
    const db = (await clientPromise).db();
    const hospitalId = new ObjectId(params.id);
    const hospital = await db.collection("hospitals").findOne({ _id: hospitalId });

    if (!hospital) {
      return new Response(JSON.stringify({ error: "Hospital not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(hospital), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("GET Hospital Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {
    const db = (await clientPromise).db();
    const hospitalId = new ObjectId(params.id);

    const result = await db.collection("hospitals").deleteOne({ _id: hospitalId });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Hospital not found, nothing deleted" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Hospital deleted successfully" }), { status: 200 });
  } catch (err) {
    console.error("DELETE Hospital Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}


export async function PUT(req, { params }) {
  try {
    const db = (await clientPromise).db();
    const hospitalId = new ObjectId(params.id);
    let data = await req.json();

    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;

    const result = await db.collection("hospitals").updateOne(
      { _id: hospitalId },
      { $set: data }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "Hospital not found, nothing updated" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Hospital updated successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT Hospital Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}