"use client";
import React, { useState } from "react";
import { Icon } from "@/app/_components/icon";
import showToast from "@/app/ui/toast";

// --- Types ---
interface FormData {
  // Step 1: Parties
  landlordName: string;
  tenantName: string;
  landlordEmail: string;
  tenantEmail: string;
  // Step 2: Property
  streetAddress: string;
  unit: string;
  city: string;
  state: string;
  zip: string;
  // Step 3: Terms
  startDate: string;
  endDate: string;
  monthlyRent: string;
  securityDeposit: string;
  // Step 4: Provisions
  petsAllowed: boolean;
  smokingPolicy: string;
  additionalNotes: string;
}

interface Step {
  id: number;
  name: string;
  icon: string;
}

interface FormFieldProps {
  label: string;
  name: keyof FormData;
  placeholder?: string;
  type?: string;
  icon?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  className?: string;
}

interface StepCardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  isActive?: boolean;
}

// --- Components ---

function StepIndicator({ steps, currentStep }: { steps: Step[], currentStep: number }) {
  return (
    <div className="relative mb-16">
      {/* Background Track */}
      <div className="absolute top-6 left-0 w-full h-px bg-gray-200 dark:bg-gray-800" />
      <div
        className="absolute top-6 left-0 h-px bg-black dark:bg-white transition-all duration-500 ease-out"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      />

      {/* Step Nodes */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep > index + 1;
          const isCurrent = currentStep === index + 1;

          return (
            <div key={step.id} className="flex flex-col items-center group">
              {/* Step Circle */}
              <div className={`relative size-12 rounded-full flex items-center justify-center transition-all duration-300 border ${isActive || isCurrent
                ? "bg-black border-black text-white dark:bg-white dark:border-white dark:text-black"
                : "bg-white border-gray-200 text-gray-400 dark:bg-black dark:border-gray-800 dark:text-gray-600"
                }`}>
                <Icon 
                  name={step.icon} 
                  className="w-5 h-5" 
                />
              </div>

              {/* Step Label */}
              <div className="mt-3 text-center">
                <span className={`block text-xs font-medium uppercase tracking-widest transition-all duration-300 ${isActive || isCurrent ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-600"
                  }`}>
                  {step.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FormField({
  label,
  name,
  placeholder,
  type = "text",
  icon = "",
  value,
  onChange,
  required = false,
  className = ""
}: FormFieldProps) {
  return (
    <div className={`group ${className}`}>
      <label className="block text-sm font-medium text-black dark:text-white mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full px-4 py-3 bg-transparent rounded-lg border border-gray-200 dark:border-gray-800 focus:border-black dark:focus:border-white focus:ring-0 text-black dark:text-white placeholder-gray-400 transition-all duration-200"
        />
        {icon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon name={icon} className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
}

function StepCard({ title, icon = '', children, isActive = false }: StepCardProps) {
  return (
    <div className="bg-white dark:bg-black animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black dark:text-white tracking-tight flex items-center gap-3">
          {icon && <Icon name={icon} className="w-6 h-6" />}
          {title}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 ml-9">Please provide the requested information below.</p>
      </div>

      {/* Content */}
      <div>
        {children}
      </div>
    </div>
  );
}

export default function ConfigurationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    // Step 1: Parties
    landlordName: "",
    tenantName: "",
    landlordEmail: "",
    tenantEmail: "",
    // Step 2: Property
    streetAddress: "",
    unit: "",
    city: "",
    state: "",
    zip: "",
    // Step 3: Terms
    startDate: "",
    endDate: "",
    monthlyRent: "",
    securityDeposit: "",
    // Step 4: Provisions
    petsAllowed: false,
    smokingPolicy: "No Smoking",
    additionalNotes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return Boolean(formData.landlordName && formData.tenantName && formData.landlordEmail && formData.tenantEmail);
      case 2:
        return Boolean(formData.streetAddress && formData.city && formData.state && formData.zip);
      case 3:
        return Boolean(formData.startDate && formData.endDate && formData.monthlyRent && formData.securityDeposit);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    } else {
      showToast("Please fill in all required fields before proceeding.", "error")
    }
  };
  
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      console.log("Form Submitted", formData);
      alert("Agreement Generated! (Check console for data)");
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const steps: Step[] = [
    { id: 1, name: "Parties", icon: 'users' },
    { id: 2, name: "Property", icon: 'home' },
    { id: 3, name: "Terms", icon: 'calendar' },
    { id: 4, name: "Provisions", icon: 'clipboardcheck' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-black dark:border-white rounded-full mb-6">
            <span className="text-xs font-bold uppercase tracking-widest">
              Lease Generator
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Agreement Configuration
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
            Complete the steps below to generate your lease agreement.
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={steps} currentStep={currentStep} />

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="animate-in fade-in duration-700">
          {/* STEP 1: THE PARTIES */}
          {currentStep === 1 && (
            <StepCard
              title="The Parties"
              icon='users'
              isActive={true}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Landlord Full Name"
                  name="landlordName"
                  placeholder="e.g., John Michael Smith"
                  value={formData.landlordName}
                  onChange={handleChange}
                  required={true}
                />
                <FormField
                  label="Tenant Full Name"
                  name="tenantName"
                  placeholder="e.g., Jane Elizabeth Doe"
                  value={formData.tenantName}
                  onChange={handleChange}
                  required={true}
                />
                <FormField
                  label="Landlord Email Address"
                  name="landlordEmail"
                  type="email"
                  placeholder="landlord@example.com"
                  icon={'mail'}
                  value={formData.landlordEmail}
                  onChange={handleChange}
                  required={true}
                />
                <FormField
                  label="Tenant Email Address"
                  name="tenantEmail"
                  type="email"
                  placeholder="tenant@example.com"
                  icon={'mail'}
                  value={formData.tenantEmail}
                  onChange={handleChange}
                  required={true}
                />
              </div>
            </StepCard>
          )}

          {/* STEP 2: PROPERTY DETAILS */}
          {currentStep === 2 && (
            <StepCard
              title="Property Details"
              icon='home'
              isActive={true}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    label="Street Address"
                    name="streetAddress"
                    placeholder="123 Main Street"
                    icon={'map-pin'}
                    value={formData.streetAddress}
                    onChange={handleChange}
                    className="md:col-span-2"
                    required={true}
                  />
                  <FormField
                    label="Unit / Apt #"
                    name="unit"
                    placeholder="Unit 4B"
                    value={formData.unit}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    label="City"
                    name="city"
                    placeholder="San Francisco"
                    value={formData.city}
                    onChange={handleChange}
                    required={true}
                  />
                  <FormField
                    label="State"
                    name="state"
                    placeholder="CA"
                    value={formData.state}
                    onChange={handleChange}
                    required={true}
                  />
                  <FormField
                    label="ZIP Code"
                    name="zip"
                    placeholder="94105"
                    value={formData.zip}
                    onChange={handleChange}
                    required={true}
                  />
                </div>
              </div>
            </StepCard>
          )}

          {/* STEP 3: TERMS & DATES */}
          {currentStep === 3 && (
            <StepCard
              title="Lease Terms & Financial Details"
              icon='calendar'
              isActive={true}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Lease Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required={true}
                />
                <FormField
                  label="Lease End Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required={true}
                />
                <FormField
                  label="Monthly Rent Amount"
                  name="monthlyRent"
                  type="number"
                  placeholder="2500"
                  icon={'dollar-sign'}
                  value={formData.monthlyRent}
                  onChange={handleChange}
                  required={true}
                />
                <FormField
                  label="Security Deposit"
                  name="securityDeposit"
                  type="number"
                  placeholder="5000"
                  icon={'dollar-sign'}
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  required={true}
                />
              </div>
            </StepCard>
          )}

          {/* STEP 4: ADDITIONAL PROVISIONS */}
          {currentStep === 4 && (
            <StepCard
              title="Additional Provisions & Policies"
              icon='clipboardcheck'
              isActive={true}
            >
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Smoking Policy */}
                  <div className="group">
                    <label className="block text-sm font-medium text-black dark:text-white mb-2">
                      <Icon name='cigarette' className="inline w-4 h-4 mr-2" />
                      Smoking Policy
                    </label>
                    <div className="relative">
                      <select
                        name="smokingPolicy"
                        value={formData.smokingPolicy}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-transparent rounded-lg border border-gray-200 dark:border-gray-800 focus:border-black dark:focus:border-white focus:ring-0 text-black dark:text-white appearance-none transition-all duration-200"
                      >
                        <option value="No Smoking" className="bg-white dark:bg-black">No Smoking Allowed</option>
                        <option value="Smoking Outside Only" className="bg-white dark:bg-black">Smoking Outside Only</option>
                        <option value="Smoking Allowed" className="bg-white dark:bg-black">Smoking Allowed</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Icon name='chevron-right' className="w-4 h-4 text-gray-400 rotate-90" />
                      </div>
                    </div>
                  </div>

                  {/* Pets Toggle */}
                  <div className="group">
                    <label className="block text-sm font-medium text-black dark:text-white mb-4">
                      <Icon name="paw-print" className="inline w-4 h-4 mr-2" />
                      Pet Policy
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        name="petsAllowed"
                        checked={formData.petsAllowed}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-black dark:peer-checked:bg-white dark:peer-checked:after:bg-black dark:peer-checked:after:border-black"></div>
                      <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Pets Allowed
                      </span>
                    </label>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="group">
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    <Icon name="file-text" className="inline w-4 h-4 mr-2" />
                    Additional Clauses & Special Conditions
                  </label>
                  <div className="relative">
                    <textarea
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Enter any special conditions, house rules, or additional clauses..."
                      className="w-full px-4 py-3 bg-transparent rounded-lg border border-gray-200 dark:border-gray-800 focus:border-black dark:focus:border-white focus:ring-0 text-black dark:text-white placeholder-gray-400 resize-none transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </StepCard>
          )}
        
          {/* Navigation */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100 dark:border-gray-900">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`group flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${currentStep === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900"
                }`}
            >
              <Icon name="chevron-left" className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Back
            </button>


            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="group inline-flex items-center justify-center px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:opacity-90 transition-all duration-200"
              >
                Continue
                <Icon name="chevron-right" className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            ) : (
              <button
                type="submit"
                className="group inline-flex items-center justify-center px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:opacity-90 transition-all duration-200"
              >
                <Icon name="sparkles" className="w-4 h-4 mr-2" />
                Generate Agreement
                <Icon name="arrow-right" className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
