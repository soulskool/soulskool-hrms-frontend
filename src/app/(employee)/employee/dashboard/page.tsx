// src/app/(employee)/employee/dashboard/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../lib/redux/store';
import { markCheckIn, markCheckOut, setTodaysAttendance } from '../../../../lib/redux/slices/attendanceSlice';
import { Clock, LogIn, LogOut, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EmployeeDashboardPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { today: todaysAttendance, loading: attendanceLoading, error: attendanceError } = useSelector((state: RootState) => state.attendance);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every second
    useEffect(() => {
        const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timerId); // Cleanup interval on unmount
    }, []);

    // TODO: Fetch today's attendance status when the component mounts if needed.
    // This depends on whether checkEmployeeAuthStatus returns this info.
    // If not, dispatch a dedicated fetch action here.
    // Example:
    // useEffect(() => {
    //     dispatch(fetchTodaysAttendance());
    // }, [dispatch]);

     // Handle check-in action
    const handleCheckIn = () => {
        dispatch(markCheckIn())
            .unwrap() // Use unwrap to handle success/error directly
            .then((result) => {
                toast.success(`Checked In at ${new Date(result.checkInTime!).toLocaleTimeString()}${result.isLate ? ' (Late)' : ''}`);
            })
            .catch((errMessage) => {
                toast.error(errMessage || 'Check-in failed');
            });
    };

    // Handle check-out action
    const handleCheckOut = () => {
        dispatch(markCheckOut())
             .unwrap()
            .then((result) => {
                toast.success(`Checked Out at ${new Date(result.checkOutTime!).toLocaleTimeString()}`);
            })
            .catch((errMessage) => {
                toast.error(errMessage || 'Check-out failed');
            });
    };

    const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formattedDate = currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const hasCheckedIn = !!todaysAttendance?.checkInTime;
    const hasCheckedOut = !!todaysAttendance?.checkOutTime;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>

            {/* Attendance Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-md mx-auto">
                <div className="text-center space-y-4">
                     {/* Clock Icon and Time */}
                     <div className="flex items-center justify-center text-gray-700 space-x-2">
                        <Clock size={24} />
                        <span className="text-3xl font-semibold">{formattedTime}</span>
                     </div>
                     {/* Date */}
                    <p className="text-sm text-gray-500">{formattedDate}</p>

                    {/* Attendance Status */}
                     <div className="pt-2 text-sm">
                        {hasCheckedIn && !hasCheckedOut && (
                             <p className="text-green-600 font-medium">Checked In at {new Date(todaysAttendance.checkInTime!).toLocaleTimeString()}{todaysAttendance.isLate ? <span className='text-orange-500'> (Late)</span> : ''}</p>
                        )}
                        {hasCheckedIn && hasCheckedOut && (
                             <p className="text-gray-600 font-medium">Completed for today.</p>
                             // Optionally show duration
                        )}
                         {!hasCheckedIn && (
                              <p className="text-gray-500 italic">Not checked in yet today.</p>
                         )}
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                        {!hasCheckedIn && (
                            <button
                                onClick={handleCheckIn}
                                disabled={attendanceLoading}
                                className="w-full btn-primary h-12 text-base flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 focus:ring-green-500"
                            >
                                {attendanceLoading ? <Loader2 className="animate-spin" size={20}/> : <LogIn size={20}/>}
                                <span>Mark Check In</span>
                            </button>
                        )}
                        {hasCheckedIn && !hasCheckedOut && (
                            <button
                                onClick={handleCheckOut}
                                disabled={attendanceLoading}
                                className="w-full btn-primary h-12 text-base flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 focus:ring-red-500"
                            >
                                 {attendanceLoading ? <Loader2 className="animate-spin" size={20}/> : <LogOut size={20}/>}
                                <span>Mark Check Out</span>
                            </button>
                        )}
                         {hasCheckedIn && hasCheckedOut && (
                             <p className="text-center text-gray-500 text-sm pt-2">Attendance marked for today.</p>
                         )}
                    </div>

                     {/* Error Display */}
                     {attendanceError && !attendanceLoading && (
                        <div className='flex items-center justify-center text-red-600 text-sm pt-3 space-x-1'>
                             <AlertCircle size={16} />
                            <span>{attendanceError}</span>
                        </div>
                     )}
                </div>
            </div>

            {/* Other dashboard widgets can go here */}
        </div>
    );
}