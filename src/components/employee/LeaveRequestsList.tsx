// src/components/employee/LeaveRequestsList.tsx
"use client";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/redux/store';
import { fetchMyLeaveRequests } from '../../lib/redux/slices/leaveSlice';
import { LeaveRequest, LeaveStatus } from '../../types';
import { Loader2, ChevronDown, AlertCircle } from 'lucide-react';

interface Props {
    status: 'Pending' | 'History';
}

// Helper to format date range and sessions
const formatLeavePeriod = (req: LeaveRequest): string => {
    const from = new Date(req.fromDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const to = new Date(req.toDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    let period = `${from} (${req.fromSession})`;
    if (from !== to) {
        period += ` - ${to} (${req.toSession})`;
    } else if (req.fromSession !== req.toSession) {
         period += ` - ${req.toSession}`; // Same day, different sessions
    }
    return period;
};

// Helper for status badge styling
const getStatusBadgeClass = (status: LeaveStatus) => {
    switch (status) {
        case 'Approved': return 'bg-green-100 text-green-800';
        case 'Rejected': return 'bg-red-100 text-red-800';
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

export default function LeaveRequestsList({ status }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const { requests, pagination, loadingRequests, error } = useSelector((state: RootState) => {
        const leaveState = state.leave;
        return status === 'Pending'
            ? { requests: leaveState.pendingRequests, pagination: leaveState.pendingPagination, loadingRequests: leaveState.loadingRequests, error: leaveState.error }
            : { requests: leaveState.historyRequests, pagination: leaveState.historyPagination, loadingRequests: leaveState.loadingRequests, error: leaveState.error };
    });

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        // Fetch page 1 when the status tab changes or component mounts
        dispatch(fetchMyLeaveRequests({ status, page: 1 }));
        setCurrentPage(1); // Reset page number when status changes
    }, [dispatch, status]);

    const loadMore = () => {
        if (currentPage < pagination.totalPages) {
            const nextPage = currentPage + 1;
            dispatch(fetchMyLeaveRequests({ status, page: nextPage }));
            setCurrentPage(nextPage);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">{status} Leave Requests</h2>

             {error && !loadingRequests && <p className='text-red-500 text-sm mb-4'>{error}</p>}

            {loadingRequests && currentPage === 1 ? (
                <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
            ) : requests.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-10 italic">No {status.toLowerCase()} requests found.</p>
            ) : (
                <div className="space-y-4">
                    {requests.map((req) => (
                        <div key={req._id} className="border rounded-md p-4 bg-gray-50/50">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusBadgeClass(req.status)}`}>
                                    {req.status}
                                </span>
                                <span className="text-xs text-gray-500">
                                    Applied on: {new Date(req.createdAt).toLocaleDateString('en-IN')}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                <div><span className="font-medium text-gray-700 block">Type:</span> {req.leaveType.charAt(0).toUpperCase() + req.leaveType.slice(1)}</div>
                                <div className="col-span-2 sm:col-span-1"><span className="font-medium text-gray-700 block">Period:</span> {formatLeavePeriod(req)}</div>
                                <div><span className="font-medium text-gray-700 block">Days:</span> {req.numberOfDays}</div>
                            </div>
                             <p className="text-sm text-gray-600 mt-2"><span className="font-medium">Reason:</span> {req.reason}</p>
                            {req.status !== 'Pending' && req.adminRemarks && (
                                <p className="text-sm text-gray-500 mt-1 italic border-l-2 pl-2 border-gray-300">
                                    <span className="font-medium">Admin Remarks:</span> {req.adminRemarks}
                                </p>
                            )}
                        </div>
                    ))}

                    {/* Load More Button */}
                    {pagination.currentPage < pagination.totalPages && (
                        <div className="pt-4 text-center">
                            <button
                                onClick={loadMore}
                                disabled={loadingRequests}
                                className="btn-secondary text-sm flex items-center justify-center mx-auto disabled:opacity-50"
                            >
                                {loadingRequests ? <Loader2 className="animate-spin mr-2" size={16}/> : <ChevronDown size={16} className="mr-1"/>}
                                {loadingRequests ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}