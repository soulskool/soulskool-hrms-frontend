// // src/app/(admin)/payroll/page.tsx
// "use client";

// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '../../../lib/redux/store';
// import { fetchEmployees } from '../../../lib/redux/slices/employeeSlice'; // Need employees for forms/lists
// import SalaryListAdmin from '../../../components/admin/SalaryListAdmin';
// import GeneratePayslipForm from '../../../components/admin/GeneratePayslipForm';
// import PayslipListAdmin from '../../../components/admin/PayslipListAdmin';
// import { DollarSign, FilePlus, List } from 'lucide-react';

// type AdminPayrollTab = 'salaries' | 'generate' | 'list';

// export default function AdminPayrollPage() {
//     const [activeTab, setActiveTab] = useState<AdminPayrollTab>('salaries');
//     const dispatch = useDispatch<AppDispatch>();

//     // Fetch employees needed for dropdowns
//     useEffect(() => {
//         dispatch(fetchEmployees());
//     }, [dispatch]);

//     const renderTabContent = () => {
//         switch (activeTab) {
//             case 'salaries': return <SalaryListAdmin />;
//             case 'generate': return <GeneratePayslipForm />;
//             case 'list': return <PayslipListAdmin />;
//             default: return null;
//         }
//     };

//        const getTabClass = (tabName: AdminPayrollTab) => {
//         return `py-3 px-5 text-sm font-medium text-center border-b-2 cursor-pointer transition-colors duration-150 ease-in-out flex items-center space-x-2 ${
//             activeTab === tabName
//                 ? 'border-blue-600 text-blue-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//         }`;
//     }

//     return (
//         <div className="space-y-6">
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Payroll Management</h1>

//             {/* Tabs */}
//             <div className="border-b border-gray-200">
//                 <nav className="-mb-px flex space-x-6" aria-label="Tabs">
//                     <button onClick={() => setActiveTab('salaries')} className={getTabClass('salaries')}>
//                          <DollarSign size={18} /><span>Manage Salaries</span>
//                     </button>
//                     <button onClick={() => setActiveTab('generate')} className={getTabClass('generate')}>
//                          <FilePlus size={18} /><span>Generate Payslip</span>
//                     </button>
//                     <button onClick={() => setActiveTab('list')} className={getTabClass('list')}>
//                         <List size={18} /><span>Generated Payslips</span>
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



// // src/app/(admin)/payroll/page.tsx
// "use client";

// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import type { AppDispatch, RootState } from '../../../lib/redux/store';
// import { fetchEmployees } from '../../../lib/redux/slices/employeeSlice';
// import SalaryListAdmin from '../../../components/admin/SalaryListAdmin';
// import GeneratePayslipForm from '../../../components/admin/GeneratePayslipForm';
// import PayslipListAdmin from '../../../components/admin/PayslipListAdmin';
// import SalaryStatementFilter from '@/components/payroll/SalaryStatementFilter';
// import SalaryStatementTable from '@/components/payroll/SalaryStatementTable';
// import { fetchSalaryStatement } from '@/lib/redux/slices/salaryStatementSlice';
// import { DollarSign, FilePlus, List, ClipboardList } from 'lucide-react';

// type AdminPayrollTab = 'salaries' | 'generate' | 'list' | 'statement';

// export default function AdminPayrollPage() {
//   const [activeTab, setActiveTab] = useState<AdminPayrollTab>('salaries');
//   const dispatch = useDispatch<AppDispatch>();

//   useEffect(() => { dispatch(fetchEmployees()); }, [dispatch]);

 
// const { year, month, rows, loading, error: stmtError } = useSelector((s: RootState) => s.salaryStatement);
// const [statementFetchedOnce, setStatementFetchedOnce] = useState(false);

// useEffect(() => {
//   if (activeTab === 'statement' && !statementFetchedOnce && !loading && !stmtError && rows.length === 0) {
//     dispatch(fetchSalaryStatement({ year, month }));
//     setStatementFetchedOnce(true);
//   }
// }, [activeTab, statementFetchedOnce, loading, stmtError, rows.length, year, month, dispatch]);


//   const getTabClass = (tabName: AdminPayrollTab) =>
//     `py-3 px-5 text-sm font-medium text-center border-b-2 cursor-pointer transition-colors duration-150 ease-in-out flex items-center space-x-2 ${
//       activeTab === tabName
//         ? 'border-blue-600 text-blue-600'
//         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//     }`;

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Payroll Management</h1>

//       <div className="border-b border-gray-200">
//         <nav className="-mb-px flex space-x-6" aria-label="Tabs">
//           <button onClick={() => setActiveTab('salaries')} className={getTabClass('salaries')}>
//             <DollarSign size={18} /><span>Manage Salaries</span>
//           </button>
//           <button onClick={() => setActiveTab('generate')} className={getTabClass('generate')}>
//             <FilePlus size={18} /><span>Generate Payslip</span>
//           </button>
//           <button onClick={() => setActiveTab('list')} className={getTabClass('list')}>
//             <List size={18} /><span>Generated Payslips</span>
//           </button>
//           <button onClick={() => setActiveTab('statement')} className={getTabClass('statement')}>
//             <ClipboardList size={18} /><span>Salary Statement</span>
//           </button>
//         </nav>
//       </div>

//       <div className="mt-4 space-y-4">
//         {activeTab === 'salaries' && <SalaryListAdmin />}
//         {activeTab === 'generate' && <GeneratePayslipForm />}
//         {activeTab === 'list' && <PayslipListAdmin />}

//         {activeTab === 'statement' && (
//           <>
//             <SalaryStatementFilter />
//             <SalaryStatementTable rows={rows} loading={loading} />
//           </>
//         )}
//       </div>
//     </div>
//   );
// }





// src/app/(admin)/payroll/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../lib/redux/store';
import { fetchEmployees } from '../../../lib/redux/slices/employeeSlice';
import SalaryListAdmin from '../../../components/admin/SalaryListAdmin';
import GeneratePayslipForm from '../../../components/admin/GeneratePayslipForm';
import PayslipListAdmin from '../../../components/admin/PayslipListAdmin';
import SalaryStatementFilter from '@/components/payroll/SalaryStatementFilter';
 import SalaryStatementTable from '@/components/payroll/SalaryStatementTable';
import { fetchSalaryStatement } from '@/lib/redux/slices/salaryStatementSlice';
import { DollarSign, FilePlus, List, ClipboardList } from 'lucide-react';

type AdminPayrollTab = 'salaries' | 'generate' | 'list' | 'statement';

export default function AdminPayrollPage() {
  const [activeTab, setActiveTab] = useState<AdminPayrollTab>('salaries');
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => { dispatch(fetchEmployees()); }, [dispatch]);

  // inside AdminPayrollPage component
const { year, month, rows, loading, error: stmtError } = useSelector((s: RootState) => s.salaryStatement);

// Track which keys we already attempted auto-fetch
const [attemptedKeys, setAttemptedKeys] = useState<Set<string>>(new Set());

useEffect(() => {
  if (activeTab !== 'statement') return;
  const key = `${year}-${month}`;

  // Only auto-fetch if:
  // - Not loading
  // - No error (avoid loops on 4xx/5xx)
  // - Not attempted before for this key
  if (!loading && !stmtError && !attemptedKeys.has(key)) {
    dispatch(fetchSalaryStatement({ year, month }));
    setAttemptedKeys(prev => new Set(prev).add(key));
  }
}, [activeTab, year, month, loading, stmtError, dispatch, attemptedKeys]);
  const getTabClass = (tabName: AdminPayrollTab) =>
    `py-3 px-5 text-sm font-medium text-center border-b-2 cursor-pointer transition-colors duration-150 ease-in-out flex items-center space-x-2 ${
      activeTab === tabName
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Payroll Management</h1>

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
          <button onClick={() => setActiveTab('statement')} className={getTabClass('statement')}>
            <ClipboardList size={18} /><span>Salary Statement</span>
          </button>
        </nav>
      </div>

      <div className="mt-4 space-y-4">
        {activeTab === 'salaries' && <SalaryListAdmin />}
        {activeTab === 'generate' && <GeneratePayslipForm />}
        {activeTab === 'list' && <PayslipListAdmin />}

        {activeTab === 'statement' && (
          <>
            <SalaryStatementFilter />
            <SalaryStatementTable rows={rows} loading={loading} />
          </>
        )}
      </div>
    </div>
  );
}
