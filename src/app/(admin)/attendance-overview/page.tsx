// src/app/(admin)/attendance-overview/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../lib/redux/store';
import { fetchTodayOverview, fetchAttendanceHistory } from '../../../lib/redux/slices/adminAttendanceSlice';
import { Users, LogIn, UserX, Clock, CalendarDays, ChevronDown, Loader2, AlertCircle } from 'lucide-react';

// Helper function to format time (e.g., 10:35 AM)
const formatTime = (isoString: string | null | undefined): string => {
    if (!isoString) return '-';
    try {
        return new Date(isoString).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
    } catch (e) {
        return 'Invalid Date';
    }
};

// Helper function to format date for history table header (e.g., Oct 23)
const formatHistoryDateHeader = (dateString: string): string => {
     try {
        const date = new Date(dateString + 'T00:00:00Z'); // Assume UTC date from backend string
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', timeZone: 'Asia/Kolkata' });
    } catch (e) {
        return 'Invalid';
    }
}

export default function AttendanceOverviewPage() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        todayOverview,
        history,
        loadingOverview,
        loadingHistory,
        error
    } = useSelector((state: RootState) => state.adminAttendance);

    const [historyPage, setHistoryPage] = useState(1);

    // Fetch data on component mount
    useEffect(() => {
        dispatch(fetchTodayOverview());
        dispatch(fetchAttendanceHistory(1)); // Fetch first page of history
    }, [dispatch]);

    const loadMoreHistory = () => {
        const nextPage = historyPage + 1;
        dispatch(fetchAttendanceHistory(nextPage));
        setHistoryPage(nextPage);
    };

    const todayDateFormatted = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata' });

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Attendance Overview</h1>
                <p className="text-sm text-gray-500">{todayDateFormatted}</p>
            </div>

             {/* Error Display */}
            {error && (
                <div className='flex items-center p-3 text-sm text-red-700 bg-red-100 rounded-md space-x-2'>
                     <AlertCircle size={18} />
                    <span>Error loading data: {error}</span>
                </div>
             )}

            {/* Today's Overview Section */}
            <section>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Today's Status</h2>
                {loadingOverview ? (
                    <div className="flex justify-center items-center h-24"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
                ) : todayOverview ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Stat Cards */}
                        <StatCard icon={Users} title="Total Active" value={todayOverview.totalActiveEmployees} color="blue" />
                        <StatCard icon={LogIn} title="Checked In" value={todayOverview.checkedInCount} color="green" />
                        <StatCard icon={UserX} title="Not Checked In" value={todayOverview.notCheckedInCount} color="gray" />
                        <StatCard icon={Clock} title="Late Check-ins" value={todayOverview.lateCheckInCount} color="orange" />
                    </div>
                ) : (
                    <p className="text-gray-500">Could not load today's overview.</p>
                )}
            </section>

            {/* Today's Check-in List */}
            <section>
                 <h2 className="text-xl font-semibold text-gray-700 mb-4">Today's Check-ins</h2>
                 <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {loadingOverview ? (
                         <div className="p-6 text-center text-gray-500">Loading list...</div>
                    ) : todayOverview && todayOverview.checkedInList.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Employee Name</th>
                                        <th scope="col" className="px-6 py-3 hidden md:table-cell">Employee ID</th>
                                        <th scope="col" className="px-6 py-3">Check-in Time</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {todayOverview.checkedInList.map(emp => (
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

             {/* Past Attendance History Section */}
            <section>
                 <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                    <CalendarDays size={20}/>
                    <span>Past Attendance History</span>
                 </h2>
                 <div className="bg-white rounded-lg shadow-md overflow-hidden">
                     {loadingHistory && !history.loadingMore ? (
                        <div className="p-10 flex justify-center items-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
                    ) : history.data && history.data.employeesAttendance.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-center text-gray-600 border-collapse">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left sticky left-0 bg-gray-100 z-20">Employee</th>
                                        {history.data && history.data.dates && history.data.dates.map(date => (
                                            <th key={date} scope="col" className="px-3 py-3 font-medium whitespace-nowrap">
                                                {formatHistoryDateHeader(date)} <br/>
                                                <span className='text-gray-500 font-normal'>{new Date(date + 'T00:00:00Z').toLocaleDateString('en-IN', { weekday: 'short', timeZone: 'Asia/Kolkata' })}</span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {history.data.employeesAttendance.map(emp => (
                                        <tr key={emp._id} className="bg-white hover:bg-gray-50/50">
                                            <td className="px-4 py-2 font-medium text-gray-900 text-left sticky left-0 bg-white z-10 whitespace-nowrap">
                                                {emp.name} <br/>
                                                <span className='text-xs text-gray-500'>{emp.employeeId}</span>
                                            </td>
                                            {history.data && history.data.dates && history.data.dates.map(date => (
                                                <td key={`${emp._id}-${date}`} className="px-3 py-2">
                                                    <span className={`font-bold ${emp.attendance[date] === 'P' ? 'text-green-600' : 'text-red-500'}`}>
                                                        {emp.attendance[date] || 'A'}
                                                    </span>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                             {/* Load More Button */}
                             <div className="p-4 border-t text-center">
                                <button
                                    onClick={loadMoreHistory}
                                    disabled={history.loadingMore}
                                    className="btn-secondary text-sm flex items-center justify-center mx-auto disabled:opacity-50"
                                >
                                    {history.loadingMore ? <Loader2 className="animate-spin mr-2" size={16}/> : <ChevronDown size={16} className="mr-1"/>}
                                    {history.loadingMore ? 'Loading...' : 'Load Older Records'}
                                </button>
                             </div>
                        </div>
                    ) : (
                         <div className="text-center p-10 text-gray-500 italic">No attendance history found.</div>
                    )}
                 </div>
            </section>

        </div>
    );
}

// Simple Stat Card Component
interface StatCardProps {
    icon: React.ElementType;
    title: string;
    value: number | string;
    color: 'blue' | 'green' | 'orange' | 'gray';
}
const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, color }) => {
     const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        orange: 'bg-orange-50 text-orange-600',
        gray: 'bg-gray-100 text-gray-600',
    };
    return (
         <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
            <div className={`p-3 rounded-full ${colorClasses[color]}`}>
                 <Icon size={20} />
            </div>
            <div>
                 <p className="text-sm text-gray-500">{title}</p>
                 <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
};