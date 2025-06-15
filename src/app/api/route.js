import { NextResponse } from "next/server";
import clientPromise, { testConnection } from "./db/connectMongo";

export async function GET(request) {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      return NextResponse.json(
        { message: "MongoDB connection is successful" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "MongoDB connection failed" },
        { status: 500 }
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
