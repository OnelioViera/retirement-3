import mongoose, { Schema, Document } from "mongoose";

interface SavingsItem {
  id: string;
  name: string;
  amount: number;
  type: "total" | "annual";
}

export interface IRetirementPlan extends Document {
  income: Array<{
    id: string;
    name: string;
    amount: number;
  }>;
  expenses: Array<{
    id: string;
    name: string;
    amount: number;
  }>;
  savings: SavingsItem[];
  savingsYears: number;
  mortgage: {
    current: number;
    future: number;
    downPayment: number;
    newMortgage: number;
    propertyTax: number;
    insurance: number;
    hoa: number;
    interestRate: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const RetirementPlanSchema = new Schema<IRetirementPlan>(
  {
    income: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
    expenses: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
    savings: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        type: {
          type: String,
          enum: ["total", "annual"],
          required: true,
        },
      },
    ],
    savingsYears: { type: Number, default: 1 },
    mortgage: {
      current: { type: Number, default: 0 },
      future: { type: Number, default: 0 },
      downPayment: { type: Number, default: 0 },
      newMortgage: { type: Number, default: 0 },
      propertyTax: { type: Number, default: 0 },
      insurance: { type: Number, default: 0 },
      hoa: { type: Number, default: 0 },
      interestRate: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.RetirementPlan ||
  mongoose.model<IRetirementPlan>("RetirementPlan", RetirementPlanSchema);
