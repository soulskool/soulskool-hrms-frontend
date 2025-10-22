// // src/app/(admin)/dashboard/employees/page.tsx

// "use client";
// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '../../../../lib/redux/store';
// import { fetchEmployees, deleteEmployee } from '../../../../lib/redux/slices/employeeSlice';
// import { PlusCircle, Edit, Trash2, UserX } from 'lucide-react';
// import { Employee } from '../../../../types';
// import AddEditEmployeeModal from '../../../../components/admin/AddEditEmployeeModal';
// import toast from 'react-hot-toast';

// export default function EmployeesPage() {
//     const dispatch = useDispatch<AppDispatch>();
//     const { employees, loading, error } = useSelector((state: RootState) => state.employees);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

//     useEffect(() => {
//         dispatch(fetchEmployees());
//     }, [dispatch]);
    
//     const handleOpenModal = (employee: Employee | null = null) => {
//         setSelectedEmployee(employee);
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setSelectedEmployee(null);
//         setIsModalOpen(false);
//     };
    
//     const handleDelete = (id: string, name: string) => {
//         if(window.confirm(`Are you sure you want to deactivate ${name}?`)) {
//             dispatch(deleteEmployee(id))
//                 .unwrap()
//                 .then(() => toast.success('Employee deactivated'))
//                 .catch((err) => toast.error(err as string));
//         }
//     };

//     return (
//         <div className="space-y-6">
//             <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
//                 <div>
//                     <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
//                     <p className="text-sm text-gray-500">Add, edit, and manage all employees in your organization.</p>
//                 </div>
//                 <button 
//                     onClick={() => handleOpenModal()}
//                     className="btn-primary w-full sm:w-auto">
//                     <PlusCircle className="w-5 h-5 mr-2" />
//                     Add Employee
//                 </button>
//             </div>

//             <div className="bg-white rounded-lg shadow-md">
//                 <div className="p-4 sm:p-6 border-b">
//                      <h2 className="text-lg font-semibold text-gray-700">Employee List</h2>
//                 </div>
                
//                 {loading && <div className="p-6 text-center text-gray-500">Loading employees...</div>}
//                 {error && <div className="p-6 text-center text-red-500">{error}</div>}
                
//                 {!loading && !error && (
//                     <div className="overflow-x-auto">
//                        {employees.length > 0 ? (
//                          <table className="w-full text-sm text-left text-gray-600">
//                             <thead className="text-xs text-gray-700 uppercase bg-gray-50">
//                                 <tr>
//                                     <th scope="col" className="px-6 py-3">Name</th>
//                                     <th scope="col" className="px-6 py-3 hidden md:table-cell">Employee ID</th>
//                                     <th scope="col" className="px-6 py-3 hidden sm:table-cell">Position</th>
//                                     <th scope="col" className="px-6 py-3 text-right">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {employees.map(emp => (
//                                     <tr key={emp._id} className="bg-white border-b hover:bg-gray-50 transition-colors">
//                                         <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{emp.employeeInfo.name}</td>
//                                         <td className="px-6 py-4 hidden md:table-cell">{emp.employeeInfo.employeeId}</td>
//                                         <td className="px-6 py-4 hidden sm:table-cell">{emp.jobDetails?.currentPosition || 'N/A'}</td>
//                                         <td className="px-6 py-4 flex items-center justify-end space-x-3">
//                                            <button onClick={() => handleOpenModal(emp)} className="text-blue-600 hover:text-blue-800" title="Edit Employee"><Edit size={18}/></button>
//                                            <button onClick={() => handleDelete(emp._id, emp.employeeInfo.name)} className="text-red-600 hover:text-red-800" title="Deactivate Employee"><Trash2 size={18}/></button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                        ) : (
//                         <div className="text-center p-10">
//                             <UserX className="mx-auto h-12 w-12 text-gray-400" />
//                             <h3 className="mt-2 text-sm font-semibold text-gray-900">No Employees Found</h3>
//                             <p className="mt-1 text-sm text-gray-500">Get started by adding a new employee.</p>
//                         </div>
//                        )}
//                     </div>
//                 )}
//             </div>
             
//              <AddEditEmployeeModal 
//                 isOpen={isModalOpen}
//                 onClose={handleCloseModal}
//                 employee={selectedEmployee}
//              />
//         </div>
//     );
// }









"use client";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../lib/redux/store';
import { fetchEmployees, deleteEmployee, clearEmployeeError } from '../../../../lib/redux/slices/employeeSlice';
import { PlusCircle, Edit, Trash2, UserX, Loader2 } from 'lucide-react';
import { Employee } from '../../../../types';
import AddEditEmployeeModal from '../../../../components/admin/AddEditEmployeeModal';
import toast from 'react-hot-toast';

export default function EmployeesPage() {
    const dispatch = useDispatch<AppDispatch>();
    // Get the full list from Redux
    const { employees, loadingList, error } = useSelector((state: RootState) => state.employees);

    const [isModalOpen, setIsModalOpen] = useState(false);
    // Store the full employee object to pass to the modal
    const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    // Find the full employee object from the list when opening for edit
    const handleOpenModal = (id: string | null = null) => {
        if (id) {
            const employee = employees.find(emp => emp._id === id);
            setEmployeeToEdit(employee || null); // Find the employee in the current Redux state
        } else {
            setEmployeeToEdit(null); // Clear for creation mode
        }
        dispatch(clearEmployeeError()); // Clear any previous submission errors
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEmployeeToEdit(null);
        // No need to clear Redux selectedEmployee as it's not used anymore
    };

    const handleDelete = (id: string, name: string) => {
        if(window.confirm(`Are you sure you want to permanently delete ${name}? This action cannot be undone.`)) {
            dispatch(deleteEmployee(id))
                .unwrap()
                .then(() => toast.success('Employee deleted'))
                .catch((err) => toast.error(err as string));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
                    <p className="text-sm text-gray-500">Add, edit, and manage all employees.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()} // Open modal for creation (no ID)
                    className="btn-primary w-full sm:w-auto">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Add Employee
                </button>
            </div>

            {/* Employee List Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 sm:p-6 border-b">
                     <h2 className="text-lg font-semibold text-gray-700">Employee List</h2>
                     {/* Can add search/filter inputs here later */}
                </div>

                {/* Loading State */}
                {loadingList && (
                    <div className="p-10 flex justify-center items-center">
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                    </div>
                )}

                {/* Error State */}
                {error && !loadingList && (
                    <div className="p-6 text-center text-red-600 bg-red-50">{error}</div>
                )}

                {/* Table / Empty State */}
                {!loadingList && !error && (
                    <div className="overflow-x-auto">
                       {employees.length > 0 ? (
                         <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3"></th> {/* For Image */}
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3 hidden md:table-cell">Employee ID</th>
                                    <th scope="col" className="px-6 py-3 hidden sm:table-cell">Position</th>
                                    <th scope="col" className="px-6 py-3 hidden lg:table-cell">Status</th>
                                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map(emp => (
                                    <tr key={emp._id} className="bg-white border-b hover:bg-gray-50/50 transition-colors duration-150 ease-in-out">
                                        <td className="px-6 py-3">
                                            <img
                                                src={emp.employeeInfo.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.employeeInfo.name)}&background=random`}
                                                alt={emp.employeeInfo.name}
                                                className="h-8 w-8 rounded-full object-cover"
                                                onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.employeeInfo.name)}&background=random`)}
                                                />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{emp.employeeInfo.name}</td>
                                        <td className="px-6 py-4 hidden md:table-cell">{emp.employeeInfo.employeeId}</td>
                                        <td className="px-6 py-4 hidden sm:table-cell">{emp.jobDetails?.currentPosition || 'N/A'}</td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${emp.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {emp.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex items-center justify-end space-x-3">
                                           <button onClick={() => handleOpenModal(emp._id)} className="text-blue-600 hover:text-blue-800 transition-colors" title="Edit Employee"><Edit size={18}/></button>
                                           <button onClick={() => handleDelete(emp._id, emp.employeeInfo.name)} className="text-red-600 hover:text-red-800 transition-colors" title="Delete Employee"><Trash2 size={18}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                       ) : (
                        // Empty State
                        <div className="text-center p-10">
                            <UserX className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">No Employees Found</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by adding a new employee using the button above.</p>
                        </div>
                       )}
                    </div>
                )}
            </div>

             {/* Modal Rendering */}
            <AddEditEmployeeModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                employeeToEdit={employeeToEdit}
             />
        </div>
    );
}
