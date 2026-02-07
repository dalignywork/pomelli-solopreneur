/**
 * Wizard page - Flow complet en 3 étapes
 * Step 1: Brand DNA
 * Step 2: Generation
 * Step 3: Export
 */

"use client";

import { useWizardStore } from "@/stores/wizardStore";
import StepBrand from "./components/StepBrand";
import StepGenerate from "./components/StepGenerate";
import StepExport from "./components/StepExport";

export default function WizardPage() {
  const currentStep = useWizardStore((state) => state.currentStep);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              🍒 Pomelli Generator
            </h1>

            {/* Step indicator */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                    step === currentStep
                      ? "bg-blue-600 text-white"
                      : step < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step < currentStep ? "✓" : step}
                </div>
              ))}
            </div>
          </div>

          {/* Step labels */}
          <div className="mt-4 flex justify-between text-sm">
            <span
              className={
                currentStep === 1
                  ? "font-semibold text-blue-600"
                  : "text-gray-500"
              }
            >
              1. Brand DNA
            </span>
            <span
              className={
                currentStep === 2
                  ? "font-semibold text-blue-600"
                  : "text-gray-500"
              }
            >
              2. Génération
            </span>
            <span
              className={
                currentStep === 3
                  ? "font-semibold text-blue-600"
                  : "text-gray-500"
              }
            >
              3. Export
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        {currentStep === 1 && <StepBrand />}
        {currentStep === 2 && <StepGenerate />}
        {currentStep === 3 && <StepExport />}
      </main>
    </div>
  );
}
