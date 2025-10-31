// // src/app/(admin)/leave-admin/page.tsx
// "use client";

// import { useState, useEffect } from 'react';
// import PendingLeaveRequests from '../../../components/admin/PendingLeaveRequests';
// import LeaveBalancesAdmin from '../../../components/admin/LeaveBalancesAdmin';
// import { Users, ListChecks, Coins } from 'lucide-react';

// type AdminTab = 'pending' | 'balances';

// export default function AdminLeaveManagementPage() {
//     const [activeTab, setActiveTab] = useState<AdminTab>('pending');

//     const renderTabContent = () => {
//         switch (activeTab) {
//             case 'pending':
//                 return <PendingLeaveRequests />;
//             case 'balances':
//                 return <LeaveBalancesAdmin />;
//             default:
//                 return null;
//         }
//     };

//     const getTabClass = (tabName: AdminTab) => {
//         return `py-3 px-5 text-sm font-medium text-center border-b-2 cursor-pointer transition-colors duration-150 ease-in-out flex items-center space-x-2 ${
//             activeTab === tabName
//                 ? 'border-blue-600 text-blue-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//         }`;
//     };

//     return (
//         <div className="space-y-6">
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Leave Administration</h1>

//             {/* Tabs */}
//             <div className="border-b border-gray-200">
//                 <nav className="-mb-px flex space-x-6" aria-label="Tabs">
//                     <button onClick={() => setActiveTab('pending')} className={getTabClass('pending')}>
//                         <ListChecks size={18} />
//                         <span>Pending Requests</span>
//                     </button>
//                     <button onClick={() => setActiveTab('balances')} className={getTabClass('balances')}>
//                          <Coins size={18} />
//                         <span>Leave Balances</span>
//                     </button>
//                 </nav>
//             </div>

//             {/* Tab Content */}
//             <div className="mt-4">
//                 {renderTabContent()}
//             </div>
//         </div>
//     );
// }






// src/app/(admin)/leave-admin/page.tsx
"use client";

import { useState, useEffect } from 'react';
import PendingLeaveRequests from '../../../components/admin/PendingLeaveRequests';
import LeaveBalancesAdmin from '../../../components/admin/LeaveBalancesAdmin';
import AdminLeaveHistoryList from '../../../components/admin/AdminLeaveHistoryList'; // Import the new component
import { Users, ListChecks, Coins, History } from 'lucide-react'; // Import History icon

type AdminTab = 'pending' | 'approved' | 'balances'; // Added 'approved' tab

export default function AdminLeaveManagementPage() {
    const [activeTab, setActiveTab] = useState<AdminTab>('pending');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'pending':
                return <PendingLeaveRequests />;
            case 'approved': // New tab content
                return <AdminLeaveHistoryList />;
            case 'balances':
                return <LeaveBalancesAdmin />;
            default:
                return null;
        }
    };

    const getTabClass = (tabName: AdminTab) => {
        return `py-3 px-5 text-sm font-medium text-center border-b-2 cursor-pointer transition-colors duration-150 ease-in-out flex items-center space-x-2 ${
            activeTab === tabName
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`;
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Leave Administration</h1>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab('pending')} className={getTabClass('pending')}>
                        <ListChecks size={18} />
                        <span>Pending Requests</span>
                    </button>
                    {/* New Approved History Tab */}
                    <button onClick={() => setActiveTab('approved')} className={getTabClass('approved')}>
                        <History size={18} />
                        <span>Approved History</span>
                    </button>
                    <button onClick={() => setActiveTab('balances')} className={getTabClass('balances')}>
                         <Coins size={18} />
                        <span>Leave Balances</span>
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
                {renderTabContent()}
            </div>
        </div>
    );
}