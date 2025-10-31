// src/components/admin/payrollPage/SalaryStatementFilter.tsx
"use client";

import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchSalaryStatement, exportSalaryStatement, setStatementMonth, clearStatementError } from '@/lib/redux/slices/salaryStatementSlice';
import { AlertCircle } from 'lucide-react';

const monthLabels = [
  { v: 1,  l: 'Jan' }, { v: 2,  l: 'Feb' }, { v: 3,  l: 'Mar' }, { v: 4,  l: 'Apr' },
  { v: 5,  l: 'May' }, { v: 6,  l: 'Jun' }, { v: 7,  l: 'Jul' }, { v: 8,  l: 'Aug' },
  { v: 9,  l: 'Sep' }, { v: 10, l: 'Oct' }, { v: 11, l: 'Nov' }, { v: 12, l: 'Dec' },
];

export default function SalaryStatementFilter() {
  const dispatch = useDispatch<AppDispatch>();
  const { year, month, loading, exporting, error, exportError } = useSelector((s: RootState) => s.salaryStatement);

  const now = new Date();
  const years = useMemo(() => {
    const y = now.getFullYear();
    return [y, y - 1, y - 2, y - 3, y - 4];
  }, [now]);

  const [localYear, setLocalYear] = useState<number>(year);
  const [localMonth, setLocalMonth] = useState<number>(month);
  const [localError, setLocalError] = useState<string | null>(null);

  const validateParams = () => {
    if (!Number.isFinite(localYear)) return 'Year is required.';
    if (!Number.isInteger(localMonth) || localMonth < 1 || localMonth > 12) return 'Month must be between 1 and 12.';
    return null;
  };

  const onFetch = () => {
    const v = validateParams();
    if (v) {
      setLocalError(v);
      return;
    }
    setLocalError(null);
    dispatch(clearStatementError());
    dispatch(setStatementMonth({ year: localYear, month: localMonth }));
    dispatch(fetchSalaryStatement({ year: localYear, month: localMonth }));
  };

  const onExport = () => {
    const v = validateParams();
    if (v) {
      setLocalError(v);
      return;
    }
    setLocalError(null);
    dispatch(exportSalaryStatement({ year: localYear, month: localMonth }));
  };

  return (
    <section className="bg-white rounded-md shadow p-4 border">
      <div className="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-3 md:space-y-0">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Year</label>
          <select
            value={localYear}
            onChange={(e) => setLocalYear(Number(e.target.value))}
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
            value={localMonth}
            onChange={(e) => setLocalMonth(Number(e.target.value))}
            className="border rounded px-3 py-2 text-sm"
          >
            {monthLabels.map((m) => (
              <option key={m.v} value={m.v}>{m.l}</option>
            ))}
          </select>
        </div>

        <div className="md:ml-auto flex gap-2">
          <button
            onClick={onFetch}
            disabled={loading}
            className="btn-secondary text-sm px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Fetching...' : 'Fetch'}
          </button>
          <button
            onClick={onExport}
            disabled={exporting}
            className="btn-primary text-sm px-4 py-2 rounded disabled:opacity-50"
          >
            {exporting ? 'Preparing...' : 'Download Excel'}
          </button>
        </div>
      </div>

      {(localError || error || exportError) && (
        <div className="mt-3 text-sm text-red-700 bg-red-100 p-2 rounded flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5" />
          <div>
            {localError ? <div>{localError}</div> : null}
            {error ? <div>{error}</div> : null}
            {exportError ? <div>{exportError}</div> : null}
          </div>
        </div>
      )}
    </section>
  );
}
