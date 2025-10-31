// src/components/tasks/ExportMonthlyTasks.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/redux/store";
import { exportMonthlyTasks } from "@/lib/redux/slices/adminTaskSlice";

const monthLabels = [
  { v: 1,  l: "Jan" }, { v: 2,  l: "Feb" }, { v: 3,  l: "Mar" }, { v: 4,  l: "Apr" },
  { v: 5,  l: "May" }, { v: 6,  l: "Jun" }, { v: 7,  l: "Jul" }, { v: 8,  l: "Aug" },
  { v: 9,  l: "Sep" }, { v: 10, l: "Oct" }, { v: 11, l: "Nov" }, { v: 12, l: "Dec" },
];

export default function ExportMonthlyTasks() {
  const dispatch = useDispatch<AppDispatch>();
  const { exporting, exportError } = useSelector((s: RootState) => s.adminTasks);

  const now = new Date();
  const [year, setYear] = useState<number>(now.getFullYear());
  const [month, setMonth] = useState<number>(now.getMonth() + 1);

  const years = useMemo(() => {
    const y = now.getFullYear();
    return [y, y - 1, y - 2, y - 3, y - 4];
  }, [now]);

  const canDownload = Number.isFinite(year) && month >= 1 && month <= 12 && !exporting;

  const onDownload = () => {
    if (!canDownload) return;
    dispatch(exportMonthlyTasks({ year, month }));
  };

  return (
    <section className="bg-white rounded-md shadow p-4 border">
      <h2 className="text-base font-semibold text-gray-700 mb-3">Export Tasks</h2>
      <div className="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-3 md:space-y-0">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border rounded px-3 py-2 text-sm"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border rounded px-3 py-2 text-sm"
          >
            {monthLabels.map((m) => (
              <option key={m.v} value={m.v}>{m.l}</option>
            ))}
          </select>
        </div>

        <div className="md:ml-auto">
          <button
            onClick={onDownload}
            disabled={!canDownload}
            className="btn-primary text-sm px-4 py-2 rounded disabled:opacity-50"
          >
            {exporting ? 'Preparing...' : 'Download Excel'}
          </button>
        </div>
      </div>

      {exportError ? (
        <div className="mt-3 text-sm text-red-600">{exportError}</div>
      ) : null}
    </section>
  );
}
