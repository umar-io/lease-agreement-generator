"use client";
import { Mail, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  // Use the user's email from your logic if available
  const userEmail = "Your Inbox"; 

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Icon Header */}
        <div className="flex justify-center">
          <div className="size-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <Mail size={40} strokeWidth={1.5} />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight dark:text-white">
            Check your email
          </h1>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            We've sent a verification link to <br />
            <span className="font-semibold text-slate-900 dark:text-slate-200">
              {userEmail}
            </span>
          </p>
        </div>

        {/* Action Card (Dashboard Blueprint Style) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <p className="text-sm text-slate-500">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          
          <div className="flex flex-col gap-3">
            <button className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20">
              Resend Verification Email
            </button>
            
            <a 
              href="https://mail.google.com" 
              target="_blank" 
              className="w-full py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold text-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
            >
              Open Mail App <ExternalLink size={14} />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}