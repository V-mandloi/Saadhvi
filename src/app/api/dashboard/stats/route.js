import { NextResponse } from 'next/server';
import clientPromise from "../../../../../lib/mongodb"; // CORRECTED FILE PATH

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("saadhvi_db");
    const referralsCollection = db.collection("referrals");

    // Get the start of the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Perform all count operations in parallel for efficiency
    const [newReferrals, activeCases, completedThisMonth, totalAssigned] = await Promise.all([
        referralsCollection.countDocuments({ status: 'Pending' }),
        referralsCollection.countDocuments({ status: 'Admitted' }),
        referralsCollection.countDocuments({ 
            status: 'Completed',
            // This assumes 'updatedAt' is stored when status changes
            updatedAt: { $gte: startOfMonth } 
        }),
        referralsCollection.countDocuments({})
    ]);

    const stats = {
        newReferrals,
        activeCases,
        completedThisMonth,
        totalAssigned
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("API GET Stats Error:", error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}