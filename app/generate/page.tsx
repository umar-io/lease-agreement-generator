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
  templateId: string;
}

interface Step {
  id: number;
  name: string;
  icon: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  recommended?: boolean;
}

// --- Sub-Components ---

function StepIndicator({
  steps,
  currentStep,
}: {
  steps: Step[];
  currentStep: number;
}) {
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
              <div
                className={`relative size-12 rounded-full flex items-center justify-center transition-all duration-300 border ${
                  isActive || isCurrent
                    ? "bg-black border-black text-white dark:bg-white dark:border-white dark:text-black"
                    : "bg-white border-gray-200 text-gray-400 dark:bg-black dark:border-gray-800 dark:text-gray-600"
                }`}
              >
                <Icon name={step.icon} className="w-5 h-5" />
              </div>
              <div className="mt-3 text-center">
                <span
                  className={`block text-xs font-medium uppercase tracking-widest ${
                    isActive || isCurrent
                      ? "text-black dark:text-white"
                      : "text-gray-400 dark:text-gray-600"
                  }`}
                >
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
  className = "",
  error = "",
}: any) {
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
          className={`w-full px-4 py-3 bg-transparent rounded-lg border ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-gray-200 dark:border-gray-800 focus:border-black dark:focus:border-white"
          } focus:ring-0 text-black dark:text-white placeholder-gray-400 transition-all duration-200`}
        />
        {icon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon name={icon} className="w-4 h-4" />
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function StepCard({
  title,
  subtitle,
  icon = "",
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-black animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black dark:text-white tracking-tight flex items-center gap-3">
          {icon && <Icon name={icon} className="w-6 h-6" />}
          {title}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 ml-9">
          {subtitle || "Please provide the requested information below."}
        </p>
      </div>
      <div>{children}</div>
    </div>
  );
}

function TemplateCard({
  template,
  selected,
  onSelect,
}: {
  template: Template;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative w-full text-left p-6 rounded-xl border-2 transition-all duration-300 ${
        selected
          ? "border-black dark:border-white bg-black/5 dark:bg-white/5"
          : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
      }`}
    >
      {template.recommended && (
        <div className="absolute -top-3 left-4 px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider rounded-full">
          Recommended
        </div>
      )}
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
            selected
              ? "bg-black dark:bg-white text-white dark:text-black"
              : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400"
          }`}
        >
          <Icon name={template.icon} className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-black dark:text-white mb-1">
            {template.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {template.description}
          </p>
          <ul className="space-y-1">
            {template.features.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500"
              >
                <Icon name="check" className="w-3 h-3" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            selected
              ? "border-black dark:border-white bg-black dark:bg-white"
              : "border-gray-300 dark:border-gray-700"
          }`}
        >
          {selected && (
            <Icon name="check" className="w-4 h-4 text-white dark:text-black" />
          )}
        </div>
      </div>
    </button>
  );
}

function ActionModal({
  isOpen,
  onClose,
  onSend,
  onSaveDraft,
  isProcessing,
  tenantEmail,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSend: () => void;
  onSaveDraft: () => void;
  isProcessing: boolean;
  tenantEmail: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
        <div className="mb-6">
          <div className="w-12 h-12 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center mb-4">
            <Icon name="file-text" className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
            Agreement Ready
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Your lease agreement has been generated successfully. Choose how you'd
            like to proceed.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onSend}
            disabled={isProcessing}
            className="w-full flex items-center justify-between p-4 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 group"
          >
            <div className="flex items-center gap-3">
              <Icon name="mail" className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Send to Tenant</div>
                <div className="text-xs opacity-80">{tenantEmail}</div>
              </div>
            </div>
            <Icon
              name="arrow-right"
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
            />
          </button>

          <button
            onClick={onSaveDraft}
            disabled={isProcessing}
            className="w-full flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-300 dark:hover:border-gray-700 transition-colors disabled:opacity-50 group"
          >
            <div className="flex items-center gap-3">
              <Icon name="save" className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Save as Draft</div>
                <div className="text-xs text-gray-500">Review and send later</div>
              </div>
            </div>
            <Icon
              name="arrow-right"
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>

        <button
          onClick={onClose}
          disabled={isProcessing}
          className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// --- Main Page Component ---

export default function ConfigurationPage() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    templateId: "standard",
  });

  const templates: Template[] = [
    {
      id: "standard",
      name: "Standard Residential",
      description: "Comprehensive residential lease for apartments and houses",
      icon: "home",
      features: [
        "All standard clauses included",
        "Maintenance responsibilities",
        "Security deposit terms",
      ],
      recommended: true,
    },
    {
      id: "short-term",
      name: "Short-Term Rental",
      description: "Flexible agreement for rentals under 12 months",
      icon: "clock",
      features: [
        "Month-to-month options",
        "Flexible termination clauses",
        "Utility management",
      ],
    },
    {
      id: "commercial",
      name: "Commercial Lease",
      description: "Professional agreement for business properties",
      icon: "briefcase",
      features: [
        "Business use provisions",
        "Signage and branding rights",
        "Commercial insurance requirements",
      ],
    },
  ];

  useEffect(() => {
    if (user?.id) {
      setFormData((prev) => ({ ...prev, profileId: user.id }));
    }
  }, [user?.id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.landlordName)
          newErrors.landlordName = "Landlord name is required";
        if (!formData.tenantName)
          newErrors.tenantName = "Tenant name is required";
        if (!formData.landlordEmail)
          newErrors.landlordEmail = "Landlord email is required";
        if (!formData.tenantEmail)
          newErrors.tenantEmail = "Tenant email is required";
        break;
      case 2:
        if (!formData.streetAddress)
          newErrors.streetAddress = "Street address is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.state) newErrors.state = "State is required";
        if (!formData.zip) newErrors.zip = "ZIP code is required";
        break;
      case 3:
        if (!formData.templateId)
          newErrors.templateId = "Please select a template";
        break;
      case 4:
        if (!formData.startDate) newErrors.startDate = "Start date is required";
        if (!formData.endDate) newErrors.endDate = "End date is required";
        if (!formData.monthlyRent)
          newErrors.monthlyRent = "Monthly rent is required";
        if (!formData.securityDeposit)
          newErrors.securityDeposit = "Security deposit is required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    } else {
      showToast("Please fill in all required fields.", "error");
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const generateAgreement = async () => {
    setIsGenerating(true);
    showToast("Generating your lease agreement...", "info");

    try {
      const response = await fetch("/api/generate-agreement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, profileId: formData.profileId }),
      });

    

      if (!response.ok) throw new Error("Failed to generate agreement");
      const { pdfUrl } = await response.json();

      setGeneratedPdfUrl(pdfUrl);
      setShowModal(true);
      showToast("Agreement generated successfully!", "success");
    } catch (error) {
      console.error("Generation Error:", error);
      showToast("Failed to generate agreement. Please try again.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendToTenant = async () => {
    setIsGenerating(true);
    try {
      const emailResponse = await fetch("/api/send-agreement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantEmail: formData.tenantEmail,
          tenantName: formData.tenantName,
          landlordName: formData.landlordName,
          pdfUrl: generatedPdfUrl,
        }),
      });

      if (!emailResponse.ok) throw new Error("Failed to send email");

      showToast(`Lease sent successfully to ${formData.tenantEmail}`, "success");
      setShowModal(false);
      // Optionally redirect or reset form
    } catch (error) {
      console.error("Email Error:", error);
      showToast("Failed to send email. Please try again.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsGenerating(true);
    try {
      const saveResponse = await fetch("/api/save-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: user?.id,
          pdfUrl: generatedPdfUrl,
          formData,
        }),
      });

      if (!saveResponse.ok) throw new Error("Failed to save draft");

      showToast("Draft saved successfully!", "success");
      setShowModal(false);
      // Optionally redirect to drafts page
    } catch (error) {
      console.error("Save Error:", error);
      showToast("Failed to save draft. Please try again.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep < 5) {
      nextStep();
      return;
    }

    // Final step - generate agreement
    await generateAgreement();
  };

  const steps: Step[] = [
    { id: 1, name: "Parties", icon: "users" },
    { id: 2, name: "Property", icon: "home" },
    { id: 3, name: "Template", icon: "layers" },
    { id: 4, name: "Terms", icon: "handshake" },
    { id: 5, name: "Provisions", icon: "calender-check" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
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

        <StepIndicator steps={steps} currentStep={currentStep} />

        <form
          onSubmit={handleSubmit}
          className="animate-in fade-in duration-700"
        >
          {currentStep === 1 && (
            <StepCard title="The Parties" icon="users">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Landlord Full Name"
                  name="landlordName"
                  placeholder="John Doe"
                  value={formData.landlordName}
                  onChange={handleChange}
                  error={errors.landlordName}
                  required
                />
                <FormField
                  label="Tenant Full Name"
                  name="tenantName"
                  placeholder="Jane Doe"
                  value={formData.tenantName}
                  onChange={handleChange}
                  error={errors.tenantName}
                  required
                />
                <FormField
                  label="Landlord Email"
                  name="landlordEmail"
                  type="email"
                  icon="mail"
                  value={formData.landlordEmail}
                  onChange={handleChange}
                  error={errors.landlordEmail}
                  required
                />
                <FormField
                  label="Tenant Email"
                  name="tenantEmail"
                  type="email"
                  icon="mail"
                  value={formData.tenantEmail}
                  onChange={handleChange}
                  error={errors.tenantEmail}
                  required
                />
              </div>
            </StepCard>
          )}

          {currentStep === 2 && (
            <StepCard title="Property Details" icon="home">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    label="Street Address"
                    name="streetAddress"
                    placeholder="123 Main Street"
                    className="md:col-span-2"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    error={errors.streetAddress}
                    required
                  />
                  <FormField
                    label="Unit / Apt #"
                    name="unit"
                    placeholder="Apt 4B"
                    value={formData.unit}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    label="City"
                    name="city"
                    placeholder="New York"
                    value={formData.city}
                    onChange={handleChange}
                    error={errors.city}
                    required
                  />
                  <FormField
                    label="State"
                    name="state"
                    placeholder="NY"
                    value={formData.state}
                    onChange={handleChange}
                    error={errors.state}
                    required
                  />
                  <FormField
                    label="ZIP Code"
                    name="zip"
                    placeholder="10001"
                    value={formData.zip}
                    onChange={handleChange}
                    error={errors.zip}
                    required
                  />
                </div>
              </div>
            </StepCard>
          )}

          {currentStep === 3 && (
            <StepCard
              title="Choose Your Template"
              subtitle="Select the lease template that best fits your needs"
              icon="layers"
            >
              <div className="space-y-4">
                {templates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    selected={formData.templateId === template.id}
                    onSelect={() =>
                      setFormData((prev) => ({
                        ...prev,
                        templateId: template.id,
                      }))
                    }
                  />
                ))}
              </div>
              {errors.templateId && (
                <p className="mt-3 text-sm text-red-500">{errors.templateId}</p>
              )}
            </StepCard>
          )}

          {currentStep === 4 && (
            <StepCard title="Lease Terms" icon="handshake">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  error={errors.startDate}
                  required
                />
                <FormField
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  error={errors.endDate}
                  required
                />
                <FormField
                  label="Monthly Rent"
                  name="monthlyRent"
                  type="number"
                  placeholder="2000"
                  icon="dollar-sign"
                  value={formData.monthlyRent}
                  onChange={handleChange}
                  error={errors.monthlyRent}
                  required
                />
                <FormField
                  label="Security Deposit"
                  name="securityDeposit"
                  type="number"
                  placeholder="2000"
                  icon="dollar-sign"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  error={errors.securityDeposit}
                  required
                />
              </div>
            </StepCard>
          )}

          {currentStep === 5 && (
            <StepCard
              title="Additional Provisions"
              subtitle="Customize additional terms and policies"
              icon="calendar-check"
            >
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Smoking Policy
                    </label>
                    <select
                      name="smokingPolicy"
                      value={formData.smokingPolicy}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-transparent rounded-lg border border-gray-200 dark:border-gray-800 focus:border-black dark:focus:border-white text-black dark:text-white"
                    >
                      <option value="No Smoking" className="dark:bg-black">
                        No Smoking Allowed
                      </option>
                      <option
                        value="Smoking Outside Only"
                        className="dark:bg-black"
                      >
                        Smoking Outside Only
                      </option>
                      <option value="Smoking Allowed" className="dark:bg-black">
                        Smoking Allowed
                      </option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium mb-4">
                      Pet Policy
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="petsAllowed"
                        checked={formData.petsAllowed}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:bg-black dark:peer-checked:bg-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      <span className="ml-3 text-sm font-medium">
                        Pets Allowed
                      </span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Additional Clauses
                    <span className="text-gray-400 font-normal ml-2">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    placeholder="Add any custom clauses or special terms..."
                    rows={5}
                    className="w-full px-4 py-3 bg-transparent rounded-lg border border-gray-200 dark:border-gray-800 text-black dark:text-white resize-none focus:border-black dark:focus:border-white"
                  />
                </div>
              </div>
            </StepCard>
          )}

          <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100 dark:border-gray-900">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1 || isGenerating}
              className="group flex items-center gap-2 px-6 py-3 font-medium disabled:text-gray-300 disabled:cursor-not-allowed transition-all"
            >
              <Icon
                name="chevron-left"
                className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
              />
              Back
            </button>

            <button
              type="submit"
              disabled={isGenerating}
              className="group inline-flex items-center justify-center px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-all min-w-[200px]"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black rounded-full animate-spin" />
                  Generating...
                </div>
              ) : currentStep !== 5 ? (
                <>
                  Continue
                  <Icon
                    name="chevron-right"
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </>
              ) : (
                <>
                  Generate Agreement
                  <Icon name="file-text" className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <ActionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSend={handleSendToTenant}
        onSaveDraft={handleSaveDraft}
        isProcessing={isGenerating}
        tenantEmail={formData.tenantEmail}
      />
    </div>
  );
}