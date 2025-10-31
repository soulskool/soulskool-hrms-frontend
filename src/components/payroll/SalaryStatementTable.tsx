// src/components/admin/payrollPage/SalaryStatementTable.tsx
"use client";

import React from 'react';
import type { SalaryStatementRow } from '@/lib/redux/slices/salaryStatementSlice';

interface Props {
  rows: SalaryStatementRow[];
  loading: boolean;
}


const formatINR = (n: number) =>
  (n ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function SalaryStatementTable({ rows, loading }: Props) {
  return (
    <section className="bg-white rounded-lg shadow-md overflow-hidden">
      {loading ? (
        <div className="p-10 text-center text-gray-500">Loading...</div>
      ) : rows.length === 0 ? (
        <div className="p-10 text-center text-gray-500 italic">No payslips found for selected month.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Employee ID</th>
                <th className="px-4 py-3">Employee Name</th>
                <th className="px-4 py-3">Designation</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3 text-right">Total Earnings</th>
                <th className="px-4 py-3 text-right">Total Deductions</th>
                <th className="px-4 py-3 text-right">Net Pay</th>
                <th className="px-4 py-3">Released</th>
                <th className="px-4 py-3">Generated At</th>
                <th className="px-4 py-3">Released At</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.payslipId} className="bg-white border-b hover:bg-gray-50/50">
                  <td className="px-4 py-2">{r.employeeId}</td>
                  <td className="px-4 py-2">{r.employeeName}</td>
                  <td className="px-4 py-2">{r.designation}</td>
                  <td className="px-4 py-2">{r.department}</td>
                  <td className="px-4 py-2">{r.month}</td>
                  <td className="px-4 py-2">{r.year}</td>
                  <td className="px-4 py-2 text-right font-mono">{formatINR(r.totalEarnings)}</td>
                  <td className="px-4 py-2 text-right font-mono">{formatINR(r.totalDeductions)}</td>
                  <td className="px-4 py-2 text-right font-mono">{formatINR(r.netPay)}</td>
                  <td className="px-4 py-2">{r.released ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2">{r.generatedAt}</td>
                  <td className="px-4 py-2">{r.releasedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}


