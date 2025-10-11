"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { PercentageInput } from "@/components/ui/percentage-input";
import { NumberInput } from "@/components/ui/number-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  TrendingUp,
  Home,
  PiggyBank,
  Save,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface IncomeItem {
  id: string;
  name: string;
  amount: number;
}

interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
}

interface SavingsItem {
  id: string;
  name: string;
  amount: number;
  type: "total" | "annual";
}

interface RetirementData {
  income: IncomeItem[];
  expenses: ExpenseItem[];
  savings: SavingsItem[];
  savingsYears: number;
  mortgage: {
    current: number;
    future: number;
    downPayment: number;
    newMortgage: number;
    monthlyTax: number;
    monthlyInsurance: number;
    monthlyHOA: number;
    interestRate: number;
    financingYears: number;
  };
}

export default function RetirementPlanner() {
  const [data, setData] = useState<RetirementData>({
    income: [
      { id: "onelio", name: "Onelio Social Security (Age 70)", amount: 0 },
      { id: "polly", name: "Polly Social Security (Age 62)", amount: 0 },
      { id: "pension", name: "Pension", amount: 0 },
    ],
    expenses: [
      { id: "mortgage", name: "Mortgage", amount: 0 },
      { id: "food", name: "Food", amount: 0 },
      { id: "gas", name: "Gas", amount: 0 },
      { id: "utilities", name: "Utilities", amount: 0 },
      { id: "healthIns", name: "Health Insurance", amount: 0 },
      { id: "houseMaint", name: "House Maintenance", amount: 0 },
      { id: "carMaint", name: "Car Maintenance", amount: 0 },
      { id: "internet", name: "Internet", amount: 0 },
      { id: "cellphone", name: "Cell Phone", amount: 0 },
      { id: "carIns", name: "Car Insurance", amount: 0 },
    ],
    savings: [
      {
        id: "pollySS",
        name: "Polly SS Savings Total",
        amount: 0,
        type: "total",
      },
      {
        id: "k401",
        name: "401K Monthly Contribution",
        amount: 0,
        type: "annual",
      },
      {
        id: "synchrony",
        name: "Synchrony Account",
        amount: 0,
        type: "total",
      },
    ],
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

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [incomeFrequency, setIncomeFrequency] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [expensesExpanded, setExpensesExpanded] = useState(false);
  const [incomeExpanded, setIncomeExpanded] = useState(false);
  const [savingsExpanded, setSavingsExpanded] = useState(false);
  const [mortgageExpanded, setMortgageExpanded] = useState(false);
  const [mortgageDetailsExpanded, setMortgageDetailsExpanded] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/retirement-plan");
        if (response.ok) {
          const planData = await response.json();

          // Migrate old data structure to new structure if needed
          if (planData.income && !Array.isArray(planData.income)) {
            planData.income = [
              {
                id: "onelio",
                name: "Onelio Social Security (Age 70)",
                amount: planData.income.onelio || 0,
              },
              {
                id: "polly",
                name: "Polly Social Security (Age 62)",
                amount: planData.income.polly || 0,
              },
              {
                id: "pension",
                name: "Pension",
                amount: planData.income.pension || 0,
              },
            ];
          } else if (!planData.income || planData.income.length === 0) {
            // Populate with default structure if empty
            planData.income = [
              {
                id: "onelio",
                name: "Onelio Social Security (Age 70)",
                amount: 0,
              },
              {
                id: "polly",
                name: "Polly Social Security (Age 62)",
                amount: 0,
              },
              {
                id: "pension",
                name: "Pension",
                amount: 0,
              },
            ];
          }

          if (planData.expenses && !Array.isArray(planData.expenses)) {
            planData.expenses = [
              {
                id: "mortgage",
                name: "Mortgage",
                amount: planData.expenses.mortgage || 0,
              },
              { id: "food", name: "Food", amount: planData.expenses.food || 0 },
              { id: "gas", name: "Gas", amount: planData.expenses.gas || 0 },
              {
                id: "utilities",
                name: "Utilities",
                amount: planData.expenses.utilities || 0,
              },
              {
                id: "healthIns",
                name: "Health Insurance",
                amount: planData.expenses.healthIns || 0,
              },
              {
                id: "houseMaint",
                name: "House Maintenance",
                amount: planData.expenses.houseMaint || 0,
              },
              {
                id: "carMaint",
                name: "Car Maintenance",
                amount: planData.expenses.carMaint || 0,
              },
              {
                id: "internet",
                name: "Internet",
                amount: planData.expenses.internet || 0,
              },
              {
                id: "cellphone",
                name: "Cell Phone",
                amount: planData.expenses.cellphone || 0,
              },
              {
                id: "carIns",
                name: "Car Insurance",
                amount: planData.expenses.carIns || 0,
              },
            ];
          } else if (!planData.expenses || planData.expenses.length === 0) {
            // Populate with default structure if empty
            planData.expenses = [
              { id: "mortgage", name: "Mortgage", amount: 0 },
              { id: "food", name: "Food", amount: 0 },
              { id: "gas", name: "Gas", amount: 0 },
              { id: "utilities", name: "Utilities", amount: 0 },
              { id: "healthIns", name: "Health Insurance", amount: 0 },
              { id: "houseMaint", name: "House Maintenance", amount: 0 },
              { id: "carMaint", name: "Car Maintenance", amount: 0 },
              { id: "internet", name: "Internet", amount: 0 },
              { id: "cellphone", name: "Cell Phone", amount: 0 },
              { id: "carIns", name: "Car Insurance", amount: 0 },
            ];
          }

          // Handle savings migration - only create defaults if needed
          if (!planData.savings || !Array.isArray(planData.savings)) {
            // Only create defaults if savings doesn't exist or is not an array (old format)
            planData.savings = [
              {
                id: "pollySS",
                name: "Polly SS Savings Total",
                amount: 0,
                type: "total",
              },
              {
                id: "k401",
                name: "401K Monthly Contribution",
                amount: 0,
                type: "annual",
              },
              {
                id: "synchrony",
                name: "Synchrony Account",
                amount: 0,
                type: "total",
              },
            ];
          } else if (planData.savings.length === 0) {
            // Populate with default structure if empty
            planData.savings = [
              {
                id: "pollySS",
                name: "Polly SS Savings Total",
                amount: 0,
                type: "total",
              },
              {
                id: "k401",
                name: "401K Monthly Contribution",
                amount: 0,
                type: "annual",
              },
              {
                id: "synchrony",
                name: "Synchrony Account",
                amount: 0,
                type: "total",
              },
            ];
          }

          // Ensure savingsYears is set
          planData.savingsYears = planData.savingsYears || 1;

          // Ensure mortgage object exists with all required fields
          if (!planData.mortgage) {
            planData.mortgage = {
              current: 0,
              future: 0,
              downPayment: 0,
              newMortgage: 0,
              monthlyTax: 0,
              monthlyInsurance: 0,
              monthlyHOA: 0,
              interestRate: 0,
              financingYears: 30,
            };
          } else {
            // Migrate old field names to new field names (if they exist)
            const mortgage = planData.mortgage as any;
            if (mortgage.propertyTax !== undefined && !mortgage.monthlyTax) {
              planData.mortgage.monthlyTax = mortgage.propertyTax / 12;
            }
            if (
              mortgage.insurance !== undefined &&
              !mortgage.monthlyInsurance
            ) {
              planData.mortgage.monthlyInsurance = mortgage.insurance / 12;
            }
            if (mortgage.hoa !== undefined && !mortgage.monthlyHOA) {
              planData.mortgage.monthlyHOA = mortgage.hoa;
            }

            // Set defaults for any missing fields (without overwriting existing values)
            planData.mortgage.current = planData.mortgage.current ?? 0;
            planData.mortgage.future = planData.mortgage.future ?? 0;
            planData.mortgage.downPayment = planData.mortgage.downPayment ?? 0;
            planData.mortgage.newMortgage = planData.mortgage.newMortgage ?? 0;
            planData.mortgage.monthlyTax = planData.mortgage.monthlyTax ?? 0;
            planData.mortgage.monthlyInsurance =
              planData.mortgage.monthlyInsurance ?? 0;
            planData.mortgage.monthlyHOA = planData.mortgage.monthlyHOA ?? 0;
            planData.mortgage.interestRate =
              planData.mortgage.interestRate ?? 0;
            planData.mortgage.financingYears =
              planData.mortgage.financingYears ?? 30;
          }

          setData(planData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-calculate new mortgage amount when future home price or down payment changes
  useEffect(() => {
    if (data.mortgage.future > 0 && data.mortgage.downPayment >= 0) {
      const newMortgageAmount =
        data.mortgage.future - data.mortgage.downPayment;
      if (newMortgageAmount !== data.mortgage.newMortgage) {
        updateMortgage("newMortgage", Math.max(0, newMortgageAmount));
      }
    }
  }, [data.mortgage.future, data.mortgage.downPayment]);

  // Auto-hide mortgage details when mortgage section is expanded
  useEffect(() => {
    if (mortgageExpanded && mortgageDetailsExpanded) {
      setMortgageDetailsExpanded(false);
    }
  }, [mortgageExpanded]);

  // Save data to database
  const saveData = async () => {
    setSaving(true);

    // Show loading toast
    const loadingToast = toast.loading("Saving your retirement plan...");

    try {
      const response = await fetch("/api/retirement-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Wait for minimum display time, then dismiss loading and show success
        setTimeout(() => {
          toast.dismiss(loadingToast);
          toast.success(
            "🎉 Your retirement plan has been saved successfully!",
            {
              duration: 4000,
              style: {
                background: "#10b981",
                color: "#fff",
              },
            }
          );
        }, 1000); // 1000ms minimum display time for loading toast
        console.log("Data saved successfully");
      } else {
        // Wait for minimum display time, then dismiss loading and show error
        setTimeout(() => {
          toast.dismiss(loadingToast);
          toast.error(
            "❌ Failed to save your retirement plan. Please try again.",
            {
              duration: 5000,
              style: {
                background: "#ef4444",
                color: "#fff",
              },
            }
          );
        }, 1000); // 1000ms minimum display time for loading toast
        console.error("Failed to save data");
      }
    } catch (error) {
      // Wait for minimum display time, then dismiss loading and show error
      setTimeout(() => {
        toast.dismiss(loadingToast);
        toast.error(
          "❌ Error saving your retirement plan. Please check your connection.",
          {
            duration: 5000,
            style: {
              background: "#ef4444",
              color: "#fff",
            },
          }
        );
      }, 1000); // 1000ms minimum display time for loading toast
      console.error("Error saving data:", error);
    } finally {
      setSaving(false);
    }
  };

  // Mortgage calculation functions
  const calculateMonthlyMortgagePayment = () => {
    const principal = data.mortgage.newMortgage;
    const annualRate = data.mortgage.interestRate / 100;
    const monthlyRate = annualRate / 12;
    const totalPayments = data.mortgage.financingYears * 12;

    if (monthlyRate === 0) {
      return principal / totalPayments;
    }

    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);

    return monthlyPayment;
  };

  const calculateTotalMonthlyMortgageCost = () => {
    const mortgagePayment = calculateMonthlyMortgagePayment();
    const monthlyTax = data.mortgage.monthlyTax;
    const monthlyInsurance = data.mortgage.monthlyInsurance;
    const monthlyHOA = data.mortgage.monthlyHOA;

    return mortgagePayment + monthlyTax + monthlyInsurance + monthlyHOA;
  };

  const calculateTotalMortgageCost = () => {
    const totalMonthlyCost = calculateTotalMonthlyMortgageCost();
    const totalPayments = data.mortgage.financingYears * 12;
    return totalMonthlyCost * totalPayments;
  };

  const calculateTotalInterest = () => {
    const totalCost = calculateTotalMortgageCost();
    return totalCost - data.mortgage.newMortgage;
  };

  const calculateMonthlyInterest = () => {
    const monthlyRate = data.mortgage.interestRate / 100 / 12;
    return data.mortgage.newMortgage * monthlyRate;
  };

  const calculateMonthlyPrincipal = () => {
    return calculateMonthlyMortgagePayment() - calculateMonthlyInterest();
  };

  // Calculate totals
  const totalMonthlyIncome = data.income.reduce(
    (sum, item) =>
      sum + (incomeFrequency === "monthly" ? item.amount : item.amount / 12),
    0
  );

  // Calculate display totals (what user sees)
  const totalDisplayIncome = data.income.reduce((sum, item) => {
    return (
      sum + (incomeFrequency === "monthly" ? item.amount : item.amount * 12)
    );
  }, 0);
  const totalMonthlyExpenses = data.expenses.reduce((sum, item) => {
    if (item.id === "mortgage") {
      return sum + calculateTotalMonthlyMortgageCost();
    }
    return sum + item.amount;
  }, 0);

  // Dashboard calculations (always monthly, independent of income frequency)
  const dashboardMonthlyIncome = data.income.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const dashboardMonthlyBalance = dashboardMonthlyIncome - totalMonthlyExpenses;

  // Summary card calculations
  const summaryCardIncome =
    incomeFrequency === "monthly" ? totalMonthlyIncome : totalDisplayIncome;
  const summaryCardExpenses =
    incomeFrequency === "monthly"
      ? totalMonthlyExpenses
      : totalMonthlyExpenses * 12;
  const summaryCardBalance = summaryCardIncome - summaryCardExpenses;

  const monthlyBalance = totalMonthlyIncome - totalMonthlyExpenses;
  const totalSavings = data.savings.reduce((sum, item) => {
    if (item.type === "annual") {
      return sum + item.amount * 12; // Convert monthly amount to annual
    }
    return sum + item.amount;
  }, 0);

  // Update functions
  const updateIncomeItem = (
    id: string,
    field: "name" | "amount",
    value: string | number
  ) => {
    setData((prev) => ({
      ...prev,
      income: prev.income.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateExpenseItem = (
    id: string,
    field: "name" | "amount",
    value: string | number
  ) => {
    setData((prev) => ({
      ...prev,
      expenses: prev.expenses.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addIncomeItem = () => {
    const newId = `income_${Date.now()}`;
    setData((prev) => ({
      ...prev,
      income: [...prev.income, { id: newId, name: "", amount: 0 }],
    }));
  };

  const removeIncomeItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      income: prev.income.filter((item) => item.id !== id),
    }));
  };

  const addExpenseItem = () => {
    const newId = `expense_${Date.now()}`;
    setData((prev) => ({
      ...prev,
      expenses: [
        ...prev.expenses,
        { id: newId, name: "New Expense", amount: 0 },
      ],
    }));
  };

  const removeExpenseItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((item) => item.id !== id),
    }));
  };

  const updateSavingsItem = (
    id: string,
    field: "name" | "amount" | "type",
    value: string | number
  ) => {
    setData((prev) => ({
      ...prev,
      savings: prev.savings.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addSavingsItem = () => {
    const newId = `savings_${Date.now()}`;
    setData((prev) => ({
      ...prev,
      savings: [
        ...prev.savings,
        { id: newId, name: "", amount: 0, type: "total" },
      ],
    }));
  };

  const removeSavingsItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      savings: prev.savings.filter((item) => item.id !== id),
    }));
  };

  const updateMortgage = (field: keyof typeof data.mortgage, value: number) => {
    setData((prev) => ({
      ...prev,
      mortgage: { ...prev.mortgage, [field]: value },
    }));
  };

  const updateSavingsYears = (value: number) => {
    setData((prev) => ({
      ...prev,
      savingsYears: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading retirement planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <TrendingUp className="text-indigo-600" size={40} />
            Retirement Financial Planner
          </h1>
          <Button
            onClick={saveData}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? "Saving..." : "Save Plan"}
          </Button>
        </div>

        {/* Summary Cards Toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex gap-2 bg-white rounded-lg border p-2 shadow-sm">
            <Button
              variant={incomeFrequency === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setIncomeFrequency("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant={incomeFrequency === "annual" ? "default" : "outline"}
              size="sm"
              onClick={() => setIncomeFrequency("annual")}
            >
              Annual
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {incomeFrequency === "monthly" ? "Monthly" : "Annual"} Income
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(summaryCardIncome)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {incomeFrequency === "monthly" ? "Monthly" : "Annual"} Expenses
              </CardTitle>
              <DollarSign className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(summaryCardExpenses)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {incomeFrequency === "monthly" ? "Monthly" : "Annual"} Balance
              </CardTitle>
              <TrendingUp
                className={`h-4 w-4 ${monthlyBalance >= 0 ? "text-blue-600" : "text-orange-600"}`}
              />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${summaryCardBalance >= 0 ? "text-blue-600" : "text-orange-600"}`}
              >
                {formatCurrency(summaryCardBalance)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Projected Savings ({data.savingsYears || 1} year
                {(data.savingsYears || 1) !== 1 ? "s" : ""})
              </CardTitle>
              <PiggyBank className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(totalSavings * (data.savingsYears || 1))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="text-green-600" />
                  {incomeFrequency === "monthly"
                    ? "Monthly Income"
                    : "Annual Income"}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIncomeExpanded(!incomeExpanded)}
                  className="h-8 px-3"
                >
                  {incomeExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Show More
                    </>
                  )}
                </Button>
              </CardTitle>
              <CardDescription>
                Enter your expected retirement income sources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {incomeExpanded && (
                <>
                  {data.income.map((item, index) => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={`income-name-${item.id}`}
                          className="flex-1"
                        >
                          <Input
                            id={`income-name-${item.id}`}
                            value={item.name}
                            onChange={(e) =>
                              updateIncomeItem(item.id, "name", e.target.value)
                            }
                            className="text-sm font-medium"
                            placeholder="Income source name"
                          />
                        </Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeIncomeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <CurrencyInput
                        id={`income-amount-${item.id}`}
                        value={item.amount}
                        onChange={(value) =>
                          updateIncomeItem(item.id, "amount", value)
                        }
                        placeholder="0"
                      />
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addIncomeItem}
                    className="w-full border-dashed"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Income Source
                  </Button>
                </>
              )}
              <div className="pt-4 border-t">
                <p className="text-lg font-semibold">
                  Total {incomeFrequency === "monthly" ? "Monthly" : "Annual"}{" "}
                  Income: {formatCurrency(totalDisplayIncome)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Expenses Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="text-red-600" />
                  Monthly Expenses
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpensesExpanded(!expensesExpanded)}
                  className="h-8 px-3"
                >
                  {expensesExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Show More
                    </>
                  )}
                </Button>
              </CardTitle>
              <CardDescription>Track your monthly expenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {expensesExpanded && (
                <>
                  {data.expenses.map((item, index) => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={`expense-name-${item.id}`}
                          className="flex-1"
                        >
                          <Input
                            id={`expense-name-${item.id}`}
                            value={item.name}
                            onChange={(e) =>
                              updateExpenseItem(item.id, "name", e.target.value)
                            }
                            className="text-sm font-medium"
                            placeholder="Expense name"
                            disabled={item.id === "mortgage"}
                          />
                        </Label>
                        {data.expenses.length > 1 && item.id !== "mortgage" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeExpenseItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      {item.id === "mortgage" ? (
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <Label className="text-sm font-medium text-gray-700">
                              Calculated Mortgage Payment
                            </Label>
                            <div className="mt-1 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900">
                              {formatCurrency(
                                calculateTotalMonthlyMortgageCost()
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <CurrencyInput
                          id={`expense-amount-${item.id}`}
                          value={item.amount}
                          onChange={(value) =>
                            updateExpenseItem(item.id, "amount", value)
                          }
                          placeholder="0"
                        />
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addExpenseItem}
                    className="w-full border-dashed"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Expense
                  </Button>
                </>
              )}
              <div className="pt-4 border-t">
                <p className="text-lg font-semibold">
                  Total Monthly Expenses: {formatCurrency(totalMonthlyExpenses)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Savings Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PiggyBank className="text-purple-600" />
                  Savings & Investments
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSavingsExpanded(!savingsExpanded)}
                  className="h-8 px-3"
                >
                  {savingsExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Show More
                    </>
                  )}
                </Button>
              </CardTitle>
              <CardDescription>
                Track your savings and investment accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {savingsExpanded && (
                <>
                  {data.savings.map((item, index) => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={`savings-name-${item.id}`}
                          className="flex-1"
                        >
                          <Input
                            id={`savings-name-${item.id}`}
                            value={item.name}
                            onChange={(e) =>
                              updateSavingsItem(item.id, "name", e.target.value)
                            }
                            className="text-sm font-medium"
                            placeholder="Savings account name"
                          />
                        </Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSavingsItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <CurrencyInput
                            id={`savings-amount-${item.id}`}
                            value={item.amount}
                            onChange={(value) =>
                              updateSavingsItem(item.id, "amount", value)
                            }
                            placeholder="0"
                          />
                        </div>
                        <div className="flex flex-col">
                          <select
                            value={item.type}
                            onChange={(e) =>
                              updateSavingsItem(
                                item.id,
                                "type",
                                e.target.value as "total" | "annual"
                              )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            style={{ minWidth: "150px" }}
                          >
                            <option value="total">Total Amount</option>
                            <option value="annual">Annual Amount</option>
                          </select>
                        </div>
                      </div>
                      {item.type === "annual" && (
                        <p className="text-sm text-muted-foreground">
                          Annual Total: {formatCurrency(item.amount * 12)}{" "}
                          (Monthly: {formatCurrency(item.amount)} × 12)
                        </p>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addSavingsItem}
                    className="w-full border-dashed"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Savings Account
                  </Button>
                </>
              )}
              <div className="pt-4 border-t space-y-4">
                <div>
                  <p className="text-lg font-semibold">
                    Total Savings: {formatCurrency(totalSavings)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="savings-years"
                      className="text-sm font-medium"
                    >
                      Years to Project:
                    </Label>
                    <NumberInput
                      id="savings-years"
                      value={data.savingsYears || 1}
                      onChange={(value) => updateSavingsYears(value)}
                      placeholder="1"
                      className="w-20"
                    />
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Projected Total: </span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(totalSavings * (data.savingsYears || 1))}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mortgage Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="text-indigo-600" />
                  Mortgage Information
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMortgageExpanded(!mortgageExpanded)}
                  className="h-8 px-3"
                >
                  {mortgageExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Show More
                    </>
                  )}
                </Button>
              </CardTitle>
              <CardDescription>
                Plan for your future home purchase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mortgageExpanded && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="future">Future Home Price</Label>
                    <CurrencyInput
                      id="future"
                      value={data.mortgage.future}
                      onChange={(value) => updateMortgage("future", value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="downPayment">Down Payment</Label>
                    <CurrencyInput
                      id="downPayment"
                      value={data.mortgage.downPayment}
                      onChange={(value) => updateMortgage("downPayment", value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newMortgage">New Mortgage Amount</Label>
                    <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900">
                      {formatCurrency(data.mortgage.newMortgage)}
                    </div>
                    <p className="text-xs text-gray-500">
                      Automatically calculated: Future Home Price - Down Payment
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Interest Rate</Label>
                    <PercentageInput
                      id="interestRate"
                      value={data.mortgage.interestRate}
                      onChange={(value) =>
                        updateMortgage("interestRate", value)
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="financingYears">Financing Years</Label>
                    <NumberInput
                      id="financingYears"
                      value={data.mortgage.financingYears}
                      onChange={(value) =>
                        updateMortgage("financingYears", value)
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyTax">Monthly Property Tax</Label>
                    <CurrencyInput
                      id="monthlyTax"
                      value={data.mortgage.monthlyTax}
                      onChange={(value) => updateMortgage("monthlyTax", value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyInsurance">Monthly Insurance</Label>
                    <CurrencyInput
                      id="monthlyInsurance"
                      value={data.mortgage.monthlyInsurance}
                      onChange={(value) =>
                        updateMortgage("monthlyInsurance", value)
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyHOA">Monthly HOA</Label>
                    <CurrencyInput
                      id="monthlyHOA"
                      value={data.mortgage.monthlyHOA}
                      onChange={(value) => updateMortgage("monthlyHOA", value)}
                      placeholder="0"
                    />
                  </div>
                </>
              )}
              <div className="pt-4 border-t space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Total Monthly Payment
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(calculateTotalMonthlyMortgageCost())}
                  </span>
                </div>
                {!mortgageExpanded && (
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setMortgageDetailsExpanded(!mortgageDetailsExpanded)
                      }
                      className="text-xs text-gray-600 hover:text-gray-800"
                    >
                      {mortgageDetailsExpanded ? (
                        <>
                          <ChevronUp className="h-3 w-3 mr-1" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3 mr-1" />
                          Show Details
                        </>
                      )}
                    </Button>
                  </div>
                )}
                {!mortgageExpanded && mortgageDetailsExpanded && (
                  <div className="grid grid-cols-1 gap-2 bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Monthly Mortgage Payment
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        {formatCurrency(calculateMonthlyMortgagePayment())}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Monthly Tax</span>
                      <span className="text-sm">
                        {formatCurrency(data.mortgage.monthlyTax)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Monthly Insurance
                      </span>
                      <span className="text-sm">
                        {formatCurrency(data.mortgage.monthlyInsurance)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Monthly HOA</span>
                      <span className="text-sm">
                        {formatCurrency(data.mortgage.monthlyHOA)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Monthly Interest Paid
                      </span>
                      <span className="text-sm text-red-600">
                        {formatCurrency(calculateMonthlyInterest())}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Monthly Principal Paid
                      </span>
                      <span className="text-sm text-blue-600">
                        {formatCurrency(calculateMonthlyPrincipal())}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Total Interest Paid
                      </span>
                      <span className="text-sm text-red-600">
                        {formatCurrency(calculateTotalInterest())}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Total Principal Paid
                      </span>
                      <span className="text-sm text-blue-600">
                        {formatCurrency(data.mortgage.newMortgage)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Total Cost of Loan
                      </span>
                      <span className="text-sm font-semibold">
                        {formatCurrency(calculateTotalMortgageCost())}
                      </span>
                    </div>
                  </div>
                )}
                {mortgageExpanded && (
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Monthly Mortgage Payment
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {formatCurrency(calculateMonthlyMortgagePayment())}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Monthly Tax</span>
                      <span className="text-sm">
                        {formatCurrency(data.mortgage.monthlyTax)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Monthly Insurance
                      </span>
                      <span className="text-sm">
                        {formatCurrency(data.mortgage.monthlyInsurance)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Monthly HOA</span>
                      <span className="text-sm">
                        {formatCurrency(data.mortgage.monthlyHOA)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Monthly Interest Paid
                      </span>
                      <span className="text-sm text-red-600">
                        {formatCurrency(calculateMonthlyInterest())}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Monthly Principal Paid
                      </span>
                      <span className="text-sm text-blue-600">
                        {formatCurrency(calculateMonthlyPrincipal())}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Total Interest Paid
                      </span>
                      <span className="text-sm text-red-600">
                        {formatCurrency(calculateTotalInterest())}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Total Principal Paid
                      </span>
                      <span className="text-sm text-blue-600">
                        {formatCurrency(data.mortgage.newMortgage)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Total Cost of Loan
                      </span>
                      <span className="text-sm font-semibold">
                        {formatCurrency(calculateTotalMortgageCost())}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Health Indicator */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Financial Health Dashboard</CardTitle>
            <CardDescription>
              Monitor your retirement financial health
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Monthly Cash Flow</span>
                <span
                  className={`font-bold ${dashboardMonthlyBalance >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatCurrency(dashboardMonthlyBalance)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all duration-300 ${
                    dashboardMonthlyBalance >= 0 ? "bg-green-500" : "bg-red-500"
                  }`}
                  style={{
                    width: `${Math.min((Math.abs(dashboardMonthlyBalance) / dashboardMonthlyIncome) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Monthly Surplus/Deficit
                </p>
                <p
                  className={`text-lg font-semibold ${dashboardMonthlyBalance >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatCurrency(dashboardMonthlyBalance)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
