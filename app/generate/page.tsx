"use client";
import React, { useState } from "react";
import { 
  Users, Home, Calendar, ClipboardCheck, 
  ChevronRight, ChevronLeft, Mail, MapPin, 
  DollarSign, PawPrint, Cigarette, FileText,
  ArrowRight, Sparkles
} from "lucide-react";

function StepIndicator({ steps, currentStep }: { steps: any[], currentStep: number }) {
  return (
    <div className="relative mb-12">
      {/* Background Track */}
      <div className="absolute top-8 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-700" />
      <div 
        className="absolute top-8 left-0 h-0.5 bg-primary transition-all duration-500 ease-out rounded-full" 
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
              <div className={`relative size-16 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                isActive || isCurrent
                  ? "bg-primary border-primary shadow-lg shadow-primary/25" 
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              }`}>
                <step.icon className={`w-7 h-7 transition-all duration-300 ${
                  isActive || isCurrent ? "text-white" : "text-slate-400"
                }`} />
              </div>
              
              {/* Step Label */}
              <div className="mt-4 text-center">
                <span className={`block text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive || isCurrent ? "text-primary" : "text-slate-400"
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
  icon, 
  value, 
  onChange,
  required = false,
  className = ""
}: any) {
  return (
    <div className={`group ${className}`}>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
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
          className="w-full px-6 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600"
        />
        {icon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-300">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

function StepCard({ title, icon, children, isActive = false }: any) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-3xl border transition-all duration-500 shadow-lg ${
      isActive ? "border-primary/30 shadow-primary/10" : "border-slate-200 dark:border-slate-800"
    }`}>
      {/* Header */}
      <div className="p-8 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-4 rounded-2xl shadow-lg shadow-primary/25">
            {React.cloneElement(icon, { className: "w-8 h-8 text-white" })}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{title}</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Fill in the required information</p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-8">
        {children}
      </div>
    </div>
  );
}

export default function ConfigurationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
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

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const steps = [
    { id: 1, name: "Parties", icon: Users },
    { id: 2, name: "Property", icon: Home },
    { id: 3, name: "Terms", icon: Calendar },
    { id: 4, name: "Provisions", icon: ClipboardCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12 animate-in">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              Lease Generator
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight mb-4">
            Agreement{" "}
            <span className="text-primary">
              Configuration
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Complete all four steps to generate your legally binding lease agreement. 
            Our intelligent system ensures compliance with your local regulations.
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={steps} currentStep={currentStep} />

        {/* Form Container */}
        <div className="animate-in" style={{ animationDelay: '400ms' }}>
          {/* STEP 1: THE PARTIES */}
          {currentStep === 1 && (
            <StepCard
              title="The Parties"
              icon={<Users />}
              isActive={true}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  icon={<Mail size={20}/>} 
                  value={formData.landlordEmail} 
                  onChange={handleChange}
                  required={true}
                />
                <FormField 
                  label="Tenant Email Address" 
                  name="tenantEmail" 
                  type="email" 
                  placeholder="tenant@example.com"
                  icon={<Mail size={20}/>} 
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
              icon={<Home />}
              isActive={true}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField 
                    label="Street Address" 
                    name="streetAddress" 
                    placeholder="123 Main Street"
                    icon={<MapPin size={20}/>} 
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
              icon={<Calendar />}
              isActive={true}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  icon={<DollarSign size={20}/>} 
                  value={formData.monthlyRent} 
                  onChange={handleChange}
                  required={true}
                />
                <FormField 
                  label="Security Deposit" 
                  name="securityDeposit" 
                  type="number" 
                  placeholder="5000"
                  icon={<DollarSign size={20}/>} 
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
              icon={<ClipboardCheck />}
              isActive={true}
            >
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Smoking Policy */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                      <Cigarette className="inline w-4 h-4 mr-2" />
                      Smoking Policy
                    </label>
                    <div className="relative">
                      <select 
                        name="smokingPolicy"
                        value={formData.smokingPolicy}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 text-slate-900 dark:text-white appearance-none transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600"
                      >
                        <option value="No Smoking" className="bg-white dark:bg-slate-900">No Smoking Allowed</option>
                        <option value="Smoking Outside Only" className="bg-white dark:bg-slate-900">Smoking Outside Only</option>
                        <option value="Smoking Allowed" className="bg-white dark:bg-slate-900">Smoking Allowed</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronRight className="w-5 h-5 text-slate-400 rotate-90" />
                      </div>
                    </div>
                  </div>

                  {/* Pets Toggle */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-6">
                      <PawPrint className="inline w-4 h-4 mr-2" />
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
                      <div className="relative w-14 h-7 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:start-[3px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-slate-300 dark:border-slate-600 peer-checked:border-primary"></div>
                      <span className="ms-4 text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
                        Pets Allowed
                      </span>
                    </label>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    <FileText className="inline w-4 h-4 mr-2" />
                    Additional Clauses & Special Conditions
                  </label>
                  <div className="relative">
                    <textarea 
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Enter any special conditions, house rules, or additional clauses (e.g., lawn maintenance responsibilities, quiet hours, parking arrangements, utility inclusions...)"
                      className="w-full px-6 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 resize-none transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600"
                    />
                  </div>
                </div>
              </div>
            </StepCard>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 animate-in" style={{ animationDelay: '600ms' }}>
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
              currentStep === 1 
                ? "text-slate-300 cursor-not-allowed" 
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg"
            }`}
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Previous Step
          </button>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
            <span>Step {currentStep} of {steps.length}</span>
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index + 1 <= currentStep ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="group inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/25 hover:bg-primary-hover hover:scale-105 transition-all duration-300"
            >
              Continue
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          ) : (
            <button
              type="submit"
              className="group inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-bold rounded-2xl shadow-lg shadow-green-500/25 hover:bg-green-700 hover:scale-105 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Agreement
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
