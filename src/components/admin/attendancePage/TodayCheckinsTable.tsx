"use client";
import React from "react";

interface CheckinRow {
  _id: string;
  name: string;
  employeeId: string;
  checkInTime: string | null;
  isLate: boolean;
}

interface TodayCheckinsTableProps {
  loading: boolean;
  rows: CheckinRow[];
  formatTime: (isoString: string | null | undefined) => string;
}

export default function TodayCheckinsTable({ loading, rows, formatTime }: TodayCheckinsTableProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Today's Check-ins</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading list...</div>
        ) : rows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50/50">
                <tr>
                  <th className="px-6 py-3">Employee Name</th>
                  <th className="px-6 py-3 hidden md:table-cell">Employee ID</th>
                  <th className="px-6 py-3">Check-in Time</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((emp) => (
                  <tr key={emp._id} className="bg-white border-b hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">{emp.name}</td>
                    <td className="px-6 py-4 hidden md:table-cell">{emp.employeeId}</td>
                    <td className="px-6 py-4">{formatTime(emp.checkInTime)}</td>
                    <td className="px-6 py-4">
                      {emp.isLate ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">Late</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">On Time</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-6 text-gray-500 italic">No employees have checked in yet today.</div>
        )}
      </div>
    </section>
  );
}
