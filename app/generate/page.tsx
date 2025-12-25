"use client";
import React, { useState } from "react";
import { 
  Users, Home, Calendar, ClipboardCheck, 
  ChevronRight, ChevronLeft, Mail, MapPin, 
  DollarSign, PawPrint, Cigarette, FileText,
  ArrowRight
} from "lucide-react";

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
    <div className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8 bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex flex-col max-w-[960px] flex-1 gap-6">
        
        {/* Progress Header */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight dark:text-white">
              Agreement Configuration
            </h1>
            <p className="text-[#616f89] dark:text-slate-400">
              Complete all four steps to finalize your lease agreement.
            </p>
          </div>

          {/* Stepper UI */}
          <div className="flex justify-between items-center relative pb-4">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center z-10 gap-2">
                <div className={`size-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  currentStep >= step.id 
                  ? "bg-primary border-primary text-white" 
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                }`}>
                  <step.icon size={20} />
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${currentStep >= step.id ? "text-primary" : "text-slate-500"}`}>
                  {step.name}
                </span>
              </div>
            ))}
            {/* Progress Track Background */}
            <div className="absolute top-6 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-0">
               <div 
                 className="h-full bg-primary transition-all duration-500" 
                 style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
               />
            </div>
          </div>
        </div>

        {/* The Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300">
          
          <div className="p-6 md:p-8 min-h-[400px]">
            {/* STEP 1: THE PARTIES */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                  <Users className="text-primary" /> The Parties
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Landlord Name" name="landlordName" placeholder="John Doe" value={formData.landlordName} onChange={handleChange} />
                  <FormField label="Tenant Name" name="tenantName" placeholder="Jane Smith" value={formData.tenantName} onChange={handleChange} />
                  <FormField label="Landlord Email" name="landlordEmail" type="email" icon={<Mail size={18}/>} value={formData.landlordEmail} onChange={handleChange} />
                  <FormField label="Tenant Email" name="tenantEmail" type="email" icon={<Mail size={18}/>} value={formData.tenantEmail} onChange={handleChange} />
                </div>
              </div>
            )}

            {/* STEP 2: PROPERTY DETAILS */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                  <Home className="text-primary" /> Property Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                  <div className="md:col-span-4">
                    <FormField label="Street Address" name="streetAddress" icon={<MapPin size={18}/>} value={formData.streetAddress} onChange={handleChange} />
                  </div>
                  <div className="md:col-span-2">
                    <FormField label="Unit / Apt" name="unit" value={formData.unit} onChange={handleChange} />
                  </div>
                  <div className="md:col-span-2">
                    <FormField label="City" name="city" value={formData.city} onChange={handleChange} />
                  </div>
                  <div className="md:col-span-2">
                    <FormField label="State" name="state" value={formData.state} onChange={handleChange} />
                  </div>
                  <div className="md:col-span-2">
                    <FormField label="Zip Code" name="zip" value={formData.zip} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: TERMS & DATES */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                  <Calendar className="text-primary" /> Terms & Dates
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
                  <FormField label="End Date" name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
                  <FormField label="Monthly Rent" name="monthlyRent" type="number" icon={<DollarSign size={18}/>} value={formData.monthlyRent} onChange={handleChange} />
                  <FormField label="Security Deposit" name="securityDeposit" type="number" icon={<DollarSign size={18}/>} value={formData.securityDeposit} onChange={handleChange} />
                </div>
              </div>
            )}

            {/* STEP 4: ADDITIONAL PROVISIONS */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                  <ClipboardCheck className="text-primary" /> Additional Provisions
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Smoking Policy */}
                  <div className="space-y-2">
                    <label className="text-base font-medium dark:text-slate-200 flex items-center gap-2">
                      <Cigarette size={18} className="text-slate-400" /> Smoking Policy
                    </label>
                    <select 
                      name="smokingPolicy"
                      value={formData.smokingPolicy}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-[#dbdfe6] dark:border-slate-600 bg-white dark:bg-slate-800 h-12 px-4 focus:ring-2 focus:ring-primary/20 outline-none dark:text-white"
                    >
                      <option>No Smoking</option>
                      <option>Smoking Outside Only</option>
                      <option>Smoking Allowed</option>
                    </select>
                  </div>

                  {/* Pets Toggle */}
                  <div className="flex flex-col justify-center">
                    <p className="text-base font-medium pb-3 dark:text-slate-200 flex items-center gap-2">
                      <PawPrint size={18} className="text-slate-400" /> Pets Allowed?
                    </p>
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="petsAllowed" 
                        checked={formData.petsAllowed} 
                        onChange={handleChange} 
                        className="sr-only peer" 
                      />
                      <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      <span className="ms-3 text-sm font-medium text-slate-600 dark:text-slate-300">Yes, pets permitted</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-base font-medium dark:text-slate-200 flex items-center gap-2">
                    <FileText size={18} className="text-slate-400" /> Additional Notes / Clauses
                  </label>
                  <textarea 
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter any special conditions (e.g., lawn maintenance, quiet hours...)"
                    className="w-full rounded-lg border border-[#dbdfe6] dark:border-slate-600 bg-white dark:bg-slate-800 p-4 focus:ring-2 focus:ring-primary/20 outline-none dark:text-white resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 1 
                ? "text-slate-300 cursor-not-allowed" 
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              <ChevronLeft size={20} /> Back
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 rounded-lg bg-primary text-white font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-primary/20"
              >
                Next Step <ChevronRight size={20} />
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 rounded-lg bg-green-600 text-white font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-lg shadow-green-500/20"
              >
                Generate Agreement <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Helper Component
function FormField({ label, name, placeholder, type = "text", icon, value, onChange }: any) {
  return (
    <label className="flex flex-col flex-1">
      <p className="text-sm font-semibold pb-2 text-slate-700 dark:text-slate-300">{label}</p>
      <div className="relative">
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`flex w-full rounded-lg border border-[#dbdfe6] dark:border-slate-600 bg-white dark:bg-slate-800 h-12 focus:ring-2 focus:ring-primary/20 px-4 outline-none transition-all dark:text-white ${
            icon ? "pr-10" : ""
          }`}
        />
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
      </div>
    </label>
  );
}