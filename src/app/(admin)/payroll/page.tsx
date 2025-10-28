// src/app/(admin)/payroll/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../lib/redux/store';
import { fetchEmployees } from '../../../lib/redux/slices/employeeSlice'; // Need employees for forms/lists
import SalaryListAdmin from '../../../components/admin/SalaryListAdmin';
import GeneratePayslipForm from '../../../components/admin/GeneratePayslipForm';
import PayslipListAdmin from '../../../components/admin/PayslipListAdmin';
import { DollarSign, FilePlus, List } from 'lucide-react';

type AdminPayrollTab = 'salaries' | 'generate' | 'list';

export default function AdminPayrollPage() {
    const [activeTab, setActiveTab] = useState<AdminPayrollTab>('salaries');
    const dispatch = useDispatch<AppDispatch>();

    // Fetch employees needed for dropdowns
    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'salaries': return <SalaryListAdmin />;
            case 'generate': return <GeneratePayslipForm />;
            case 'list': return <PayslipListAdmin />;
            default: return null;
        }
    };

       const getTabClass = (tabName: AdminPayrollTab) => {
        return `py-3 px-5 text-sm font-medium text-center border-b-2 cursor-pointer transition-colors duration-150 ease-in-out flex items-center space-x-2 ${
            activeTab === tabName
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Payroll Management</h1>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab('salaries')} className={getTabClass('salaries')}>
                         <DollarSign size={18} /><span>Manage Salaries</span>
                    </button>
                    <button onClick={() => setActiveTab('generate')} className={getTabClass('generate')}>
                         <FilePlus size={18} /><span>Generate Payslip</span>
                    </button>
                    <button onClick={() => setActiveTab('list')} className={getTabClass('list')}>
                        <List size={18} /><span>Generated Payslips</span>
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
// Include getTabClass helper function inside or import it
const getTabClass = (tabName: AdminPayrollTab, activeTab: AdminPayrollTab) => {
    return `py-3 px-5 text-sm font-medium text-center border-b-2 cursor-pointer transition-colors duration-150 ease-in-out flex items-center space-x-2 ${
        activeTab === tabName
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`;
};