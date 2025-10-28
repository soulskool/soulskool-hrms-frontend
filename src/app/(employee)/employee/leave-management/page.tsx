// src/app/(employee)/employee/leave-management/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../lib/redux/store';
import { fetchLeaveBalance } from '../../../../lib/redux/slices/leaveSlice';
import ApplyLeaveForm from '../../../../components/employee/ApplyLeaveForm';
import LeaveRequestsList from '../../../../components/employee/LeaveRequestsList';
import { Briefcase, Clock, History, Loader2, AlertCircle } from 'lucide-react';

type Tab = 'apply' | 'pending' | 'history';

export default function LeaveManagementPage() {
    const dispatch = useDispatch<AppDispatch>();
    const [activeTab, setActiveTab] = useState<Tab>('apply');
    const { balance, loadingBalance, error } = useSelector((state: RootState) => state.leave);

    useEffect(() => {
        dispatch(fetchLeaveBalance());
    }, [dispatch]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'apply':
                return <ApplyLeaveForm />;
            case 'pending':
                return <LeaveRequestsList status="Pending" />;
            case 'history':
                return <LeaveRequestsList status="History" />;
            default:
                return null;
        }
    };

    const getTabClass = (tabName: Tab) => {
        return `py-3 px-4 text-sm font-medium text-center border-b-2 cursor-pointer transition-colors duration-150 ease-in-out ${
            activeTab === tabName
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`;
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Leave Management</h1>

            {/* Leave Balances Display */}
            <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Your Leave Balances</h2>
                 {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}
                {loadingBalance ? (
                     <div className="flex justify-center items-center h-16"><Loader2 className="animate-spin text-blue-500" /></div>
                ) : balance ? (
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div><p className="text-xs text-gray-500 uppercase">Earned</p><p className="text-xl font-bold">{balance.earned}</p></div>
                        <div><p className="text-xs text-gray-500 uppercase">Sick</p><p className="text-xl font-bold">{balance.sick}</p></div>
                        <div><p className="text-xs text-gray-500 uppercase">Casual</p><p className="text-xl font-bold">{balance.casual}</p></div>
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm italic">Could not load balances.</p>
                )}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab('apply')} className={getTabClass('apply')}>Apply for Leave</button>
                    <button onClick={() => setActiveTab('pending')} className={getTabClass('pending')}>Pending Requests</button>
                    <button onClick={() => setActiveTab('history')} className={getTabClass('history')}>Leave History</button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
                {renderTabContent()}
            </div>
        </div>
    );
}