import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import { saveOnboarding } from "./actions";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-soft">
        <div className="text-center">
          <div className="inline-flex items-center justify-center size-16 rounded-3xl bg-primary/10 text-primary mb-6">
            <span className="text-2xl font-black">LG</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter">Final touches.</h1>
          <p className="text-slate-500 mt-2 font-medium">Let's set up your landlord profile.</p>
        </div>

        <form action={saveOnboarding} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2 block">Full Name</label>
              <input name="fullName" required className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-4 focus:ring-primary/10 transition-all outline-none" placeholder="Alex Rivera" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2 block">Company Name (Optional)</label>
              <input name="companyName" className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-4 focus:ring-primary/10 transition-all outline-none" placeholder="Rivera Properties LLC" />
            </div>
          </div>

          <button type="submit" className="w-full py-5 bg-primary text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]">
            Complete Setup
          </button>
        </form>
      </div>
    </div>
  );
}