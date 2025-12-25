"use client";
import React from 'react';
import { 
  FileText, 
  MoreVertical, 
  Download, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';

const DOCUMENTS = [
  { id: 1, title: "Standard Lease - 123 Maple St", tenant: "Sarah Johnson", status: "Completed", date: "Oct 12, 2023" },
  { id: 2, title: "Commercial Agreement - Suite B", tenant: "TechCorp Inc.", status: "Pending", date: "Oct 24, 2023" },
  { id: 3, title: "Month-to-Month - Apt 4C", tenant: "Michael Chen", status: "Draft", date: "Nov 02, 2023" },
];

export default function DocumentsPage() {
  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight dark:text-white">My Documents</h1>
          <p className="text-slate-500 mt-1">Manage and track your lease agreements.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input placeholder="Search documents..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary/10 transition-all" />
          </div>
          <button className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
            <Filter size={20} className="text-slate-600" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-soft overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Document</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Tenant</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Last Modified</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {DOCUMENTS.map((doc) => (
              <tr key={doc.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                      <FileText size={20} />
                    </div>
                    <span className="font-bold dark:text-white">{doc.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{doc.tenant}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={doc.status} />
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{doc.date}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button title="Download PDF" className="p-2 text-slate-400 hover:text-primary transition-colors"><Download size={18} /></button>
                    <button title="Send for Signature" className="p-2 text-slate-400 hover:text-primary transition-colors"><Send size={18} /></button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"><MoreVertical size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    Completed: "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
    Pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    Draft: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  };

  const icons: any = {
    Completed: <CheckCircle2 size={12} />,
    Pending: <Clock size={12} />,
    Draft: <AlertCircle size={12} />,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
}