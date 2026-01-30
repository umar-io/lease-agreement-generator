"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@/app/_components/icon";
import showToast from "@/app/ui/toast";
import { useAuth } from "@/app/hooks/auth-context";

// --- Types ---
interface FormData {
  profileId: string;
  landlordName: string;
  tenantName: string;
  landlordEmail: string;
  tenantEmail: string;
  streetAddress: string;
  unit: string;
  city: string;
  state: string;
  zip: string;
  startDate: string;
  endDate: string;
  monthlyRent: string;
  securityDeposit: string;
  petsAllowed: boolean;
  smokingPolicy: string;
  additionalNotes: string;
}

interface Step {
  id: number;
  name: string;
  icon: string;
}

// --- Sub-Components ---

function StepIndicator({ steps, currentStep }: { steps: Step[]; currentStep: number }) {
  return (
    <div className="relative mb-16">
      <div className="absolute top-6 left-0 w-full h-px bg-gray-200 dark:bg-gray-800" />
      <div
        className="absolute top-6 left-0 h-px bg-black dark:bg-white transition-all duration-500 ease-out"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      />
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep > index + 1;
          const isCurrent = currentStep === index + 1;
          return (
            <div key={step.id} className="flex flex-col items-center group">
              <div className={`relative size-12 rounded-full flex items-center justify-center transition-all duration-300 border ${
                isActive || isCurrent
                  ? "bg-black border-black text-white dark:bg-white dark:border-white dark:text-black"
                  : "bg-white border-gray-200 text-gray-400 dark:bg-black dark:border-gray-800 dark:text-gray-600"
              }`}>
                <Icon name={step.icon} className="w-5 h-5" />
              </div>
              <div className="mt-3 text-center">
                <span className={`block text-xs font-medium uppercase tracking-widest ${
                  isActive || isCurrent ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-600"
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

function FormField({ label, name, placeholder, type = "text", icon = "", value, onChange, required = false, className = "" }: any) {
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
        {icon && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"><Icon name={icon} className="w-4 h-4" /></div>}
      </div>
    </div>
  );
}

function StepCard({ title, icon = '', children }: { title: string; icon?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-black animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black dark:text-white tracking-tight flex items-center gap-3">
          {icon && <Icon name={icon} className="w-6 h-6" />}
          {title}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 ml-9">Please provide the requested information below.</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

// --- Main Page Component ---

export default function ConfigurationPage() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    profileId: "",
    landlordName: "",
    tenantName: "",
    landlordEmail: "",
    tenantEmail: "",
    streetAddress: "",
    unit: "",
    city: "",
    state: "",
    zip: "",
    startDate: "",
    endDate: "",
    monthlyRent: "",
    securityDeposit: "",
    petsAllowed: false,
    smokingPolicy: "No Smoking",
    additionalNotes: "",
  });

  // 1. CRITICAL: Sync Profile ID as soon as user is available
  useEffect(() => {
    if (user?.id) {
      setFormData((prev) => ({ ...prev, profileId: user.id }));
    }
  }, [user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: return !!(formData.landlordName && formData.tenantName && formData.landlordEmail && formData.tenantEmail);
      case 2: return !!(formData.streetAddress && formData.city && formData.state && formData.zip);
      case 3: return !!(formData.startDate && formData.endDate && formData.monthlyRent && formData.securityDeposit);
      default: return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) setCurrentStep((prev) => Math.min(prev + 1, 4));
    else showToast("Please fill in all required fields.", "error");
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // 2. TRIGGER LOGIC: Immediate feedback before backend finishes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep < 4) {
      nextStep();
      return;
    }

    // Start UI processing immediately
    setIsGenerating(true);
    showToast("Initializing AI lease generation...", "info");

    try {
      // Step A: Generate PDF and update DB (Backend must handle the update)
      const response = await fetch('/api/generate-agreement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, profileId: user?.id })
      });

      if (!response.ok) throw new Error('Failed to generate agreement');
      const { pdfUrl } = await response.json();

      showToast("PDF generated! Preparing email delivery...", "info");

      // Step B: Send the agreement via email
      const emailResponse = await fetch('/api/send-agreement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tenantEmail: formData.tenantEmail,
          tenantName: formData.tenantName,
          landlordName: formData.landlordName,
          pdfUrl 
        })
      });

      if (!emailResponse.ok) throw new Error('Failed to send email');

      showToast(`Success! Lease sent to ${formData.tenantEmail}`, "success");
      
    } catch (error) {
      console.error('Workflow Error:', error);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const steps: Step[] = [
    { id: 1, name: "Parties", icon: 'users' },
    { id: 2, name: "Property", icon: 'home' },
    { id: 3, name: "Terms", icon: 'handshake' },
    { id: 4, name: "Provisions", icon: 'calender-check' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-black dark:border-white rounded-full mb-6">
            <span className="text-xs font-bold uppercase tracking-widest">Lease Generator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Agreement Configuration</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
            Complete the steps below to generate your lease agreement.
          </p>
        </div>

        <StepIndicator steps={steps} currentStep={currentStep} />

        <form onSubmit={handleSubmit} className="animate-in fade-in duration-700">
          {currentStep === 1 && (
            <StepCard title="The Parties" icon="users">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Landlord Full Name" name="landlordName" placeholder="John Doe" value={formData.landlordName} onChange={handleChange} required />
                <FormField label="Tenant Full Name" name="tenantName" placeholder="Jane Doe" value={formData.tenantName} onChange={handleChange} required />
                <FormField label="Landlord Email" name="landlordEmail" type="email" icon="mail" value={formData.landlordEmail} onChange={handleChange} required />
                <FormField label="Tenant Email" name="tenantEmail" type="email" icon="mail" value={formData.tenantEmail} onChange={handleChange} required />
              </div>
            </StepCard>
          )}

          {currentStep === 2 && (
            <StepCard title="Property Details" icon="home">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField label="Street Address" name="streetAddress" className="md:col-span-2" value={formData.streetAddress} onChange={handleChange} required />
                  <FormField label="Unit / Apt #" name="unit" value={formData.unit} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField label="City" name="city" value={formData.city} onChange={handleChange} required />
                  <FormField label="State" name="state" value={formData.state} onChange={handleChange} required />
                  <FormField label="ZIP Code" name="zip" value={formData.zip} onChange={handleChange} required />
                </div>
              </div>
            </StepCard>
          )}

          {currentStep === 3 && (
            <StepCard title="Lease Terms" icon="handshake">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
                <FormField label="End Date" name="endDate" type="date" value={formData.endDate} onChange={handleChange} required />
                <FormField label="Monthly Rent" name="monthlyRent" type="number" icon="dollar-sign" value={formData.monthlyRent} onChange={handleChange} required />
                <FormField label="Security Deposit" name="securityDeposit" type="number" icon="dollar-sign" value={formData.securityDeposit} onChange={handleChange} required />
              </div>
            </StepCard>
          )}

          {currentStep === 4 && (
            <StepCard title="Provisions" icon="calender-check">
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium mb-2">Smoking Policy</label>
                    <select name="smokingPolicy" value={formData.smokingPolicy} onChange={handleChange} className="w-full px-4 py-3 bg-transparent rounded-lg border border-gray-200 dark:border-gray-800 focus:border-black dark:focus:border-white text-black dark:text-white">
                      <option value="No Smoking" className="dark:bg-black">No Smoking Allowed</option>
                      <option value="Smoking Outside Only" className="dark:bg-black">Smoking Outside Only</option>
                      <option value="Smoking Allowed" className="dark:bg-black">Smoking Allowed</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium mb-4">Pet Policy</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="petsAllowed" checked={formData.petsAllowed} onChange={handleChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:bg-black dark:peer-checked:bg-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      <span className="ml-3 text-sm font-medium">Pets Allowed</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Additional Clauses</label>
                  <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleChange} rows={5} className="w-full px-4 py-3 bg-transparent rounded-lg border border-gray-200 dark:border-gray-800 text-black dark:text-white resize-none" />
                </div>
              </div>
            </StepCard>
          )}

          <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100 dark:border-gray-900">
            <button type="button" onClick={prevStep} disabled={currentStep === 1 || isGenerating} className="group flex items-center gap-2 px-6 py-3 font-medium disabled:text-gray-300">
              <Icon name="chevron-left" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
            </button>
            
            <button type="submit" disabled={isGenerating} className="group inline-flex items-center justify-center px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:opacity-90 disabled:opacity-50">
              {isGenerating ? (
                "Processing..."
              ) : currentStep < 4 ? (
                <>Continue <Icon name="chevron-right" className="w-4 h-4 ml-2 group-hover:translate-x-1" /></>
              ) : (
                <>Send to Tenant <Icon name="mail" className="w-4 h-4 ml-2" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}