import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import RetirementPlan from "@/models/RetirementPlan";

export async function GET() {
  try {
    await connectDB();

    // Get the first retirement plan (since we're not using auth)
    const plan = await RetirementPlan.findOne().sort({ createdAt: -1 });

    if (!plan) {
      // Create a default plan with empty arrays if none exists
      const defaultPlan = new RetirementPlan({
        income: [],
        expenses: [],
        savings: [],
        savingsYears: 1,
        mortgage: {
          current: 0,
          future: 0,
          downPayment: 0,
          newMortgage: 0,
          monthlyTax: 0,
          monthlyInsurance: 0,
          monthlyHOA: 0,
          interestRate: 0,
          financingYears: 30,
        },
      });
      await defaultPlan.save();
      return NextResponse.json(defaultPlan);
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error fetching retirement plan:", error);
    return NextResponse.json(
      { error: "Failed to fetch retirement plan" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const data = await request.json();

    // Update the existing plan or create a new one
    const plan = await RetirementPlan.findOneAndUpdate({}, data, {
      upsert: true,
      new: true,
      runValidators: true,
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error saving retirement plan:", error);
    return NextResponse.json(
      { error: "Failed to save retirement plan" },
      { status: 500 }
    );
  }
}
