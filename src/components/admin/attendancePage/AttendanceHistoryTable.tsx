"use client";
import React from "react";
import { CalendarDays, ChevronDown, Loader2 } from "lucide-react";

type AttendanceLetter = 'P' | 'A';

interface EmployeeAttendance {
  _id: string;
  name: string;
  employeeId: string;
  attendance: Record<string, AttendanceLetter | undefined>;
}

interface AttendanceHistoryData {
  employeesAttendance: EmployeeAttendance[];
  dates: string[];         // 'YYYY-MM-DD', newest first
  currentPage: number;
  hasMore: boolean;
}

interface AttendanceHistoryTableProps {
  loadingInitial: boolean;
  loadingMore: boolean;
  data: AttendanceHistoryData | null;
  formatHistoryDateHeader: (dateString: string) => string;
  onLoadMore: () => void;
  hasMore: boolean;
}

export default function AttendanceHistoryTable({
  loadingInitial,
  loadingMore,
  data,
  formatHistoryDateHeader,
  onLoadMore,
  hasMore
}: AttendanceHistoryTableProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center space-x-2">
        <CalendarDays size={20}/>
        <span>Past Attendance History</span>
      </h2>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loadingInitial && !loadingMore ? (
          <div className="p-10 flex justify-center items-center">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : data && data.employeesAttendance.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center text-gray-600 border-collapse">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left sticky left-0 bg-gray-100 z-20">Employee</th>
                  {data.dates.map((date) => (
                    <th key={date} className="px-3 py-3 font-medium whitespace-nowrap">
                      {formatHistoryDateHeader(date)} <br/>
                      <span className="text-gray-500 font-normal">
                        {new Date(date + 'T00:00:00Z').toLocaleDateString('en-IN', { weekday: 'short', timeZone: 'Asia/Kolkata' })}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.employeesAttendance.map((emp) => (
                  <tr key={emp._id} className="bg-white hover:bg-gray-50/50">
                    <td className="px-4 py-2 font-medium text-gray-900 text-left sticky left-0 bg-white z-10 whitespace-nowrap">
                      {emp.name} <br/>
                      <span className="text-xs text-gray-500">{emp.employeeId}</span>
                    </td>

                    {data.dates.map((date) => {
                      const val = emp.attendance[date] ?? 'A';
                      const color = val === 'P' ? 'text-green-600' : 'text-red-500';
                      return (
                        <td key={`${emp._id}-${date}`} className="px-3 py-2">
                          <span className={`font-bold ${color}`}>{val}</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-4 border-t text-center">
              <button
                onClick={onLoadMore}
                disabled={loadingMore || !hasMore}
                className="btn-secondary text-sm flex items-center justify-center mx-auto disabled:opacity-50"
              >
                {loadingMore ? <Loader2 className="animate-spin mr-2" size={16}/> : <ChevronDown size={16} className="mr-1"/>}
                {loadingMore ? 'Loading...' : (hasMore ? 'Load Older Records' : 'No older records')}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-10 text-gray-500 italic">No attendance history found.</div>
        )}
      </div>
    </section>
  );
}
