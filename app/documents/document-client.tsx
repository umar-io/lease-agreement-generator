"use client";

import {
  FileText,
  MoreVertical,
  Download,
  Send,
  Search,
  Circle,  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { JSX, useState } from "react";

type Lease = {
  id: string;
  tenantName: string;
  status: string;
  updatedAt: string;
};

export default function DocumentsClient({ leases }: { leases: Lease[] }) {
  const [sendingId, setSendingId] = useState<string | null>(null);

  const handleSendForSignature = async (leaseId: string) => {
    try {
      setSendingId(leaseId);

      const res = await fetch("/api/send-agreement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leaseId }),
      });

      if (!res.ok) throw new Error("Failed to send");
    } catch (err) {
      console.error(err);
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">My Documents</h1>
          <p className="text-slate-500 mt-1">
            Manage and track your lease agreements.
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border"
            />
          </div>
          <button className="p-2 border rounded-xl">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border shadow-soft overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="px-6 py-4 text-xs font-black uppercase">Document</th>
              <th className="px-6 py-4 text-xs font-black uppercase">Tenant</th>
              <th className="px-6 py-4 text-xs font-black uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-black uppercase">
                Last Modified
              </th>
              <th className="px-6 py-4" />
            </tr>
          </thead>

          <tbody className="divide-y">
            {leases.map((doc) => (
              <tr
                key={doc.id}
                className="group hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-primary/5 flex items-center justify-center">
                      <FileText size={20} />
                    </div>
                    <span className="font-bold">{doc.tenantName}</span>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-slate-600">
                  {doc.tenantName}
                </td>

                <td className="px-6 py-4">
                  <StatusBadge status={doc.status} />
                </td>

                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(doc.updatedAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-primary">
                      <Download size={18} />
                    </button>

                    <button
                      onClick={() => handleSendForSignature(doc.id)}
                      disabled={sendingId === doc.id}
                      className="p-2 text-slate-400 hover:text-primary"
                    >
                      {sendingId === doc.id ? (
                        <Circle size={18} className="animate-spin" />
                      ) : (
                        <Send size={18} />
                      )}
                    </button>

                    <button className="p-2 text-slate-400 hover:text-slate-600">
                      <MoreVertical size={18} />
                    </button>
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
  const styles: Record<string, string> = {
    Completed: "bg-green-50 text-green-700 border-green-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Draft: "bg-yellow-100 text-slate-600 border-slate-200",
  };

  const icons: Record<string, JSX.Element> = {
    Completed: <CheckCircle2 size={12} />,
    Pending: <Clock size={12} />,
    Draft: <AlertCircle size={12} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase border ${styles[status]}`}
    >
      {icons[status]}
      {status}
    </span>
  );
}
