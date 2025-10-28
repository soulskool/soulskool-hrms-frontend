// src/app/(admin)/tasks/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../lib/redux/store';
import { fetchAdminTasks, adminCreateTask, adminUpdateTask, adminUpdateTaskStatus, adminDeleteTask, clearAdminTaskError } from '../../../lib/redux/slices/adminTaskSlice';
import { fetchEmployees } from '../../../lib/redux/slices/employeeSlice'; // Import action to fetch employees
import TaskList from '../../../components/tasks/TaskList';
import TaskFormModal from '../../../components/tasks/TaskFormModal';
import { Task, AdminTaskFormData, TaskStatus, TaskFormData } from '../../../types';
import { PlusCircle, ListTodo, ListChecks, Filter, X as ClearFilterIcon } from 'lucide-react';
import toast from 'react-hot-toast';

type TaskTab = 'Open' | 'Completed';

export default function AdminTasksPage() {
    const dispatch = useDispatch<AppDispatch>();
    const [activeTab, setActiveTab] = useState<TaskTab>('Open');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [filterAssigneeId, setFilterAssigneeId] = useState<string>('');

    const {
        openTasks, completedTasks, openPagination, completedPagination, loading, actionLoading, error
    } = useSelector((state: RootState) => state.adminTasks);
    // Fetch employee list for the filter dropdown
  const { employees: employeeList, loadingList: employeesLoading } = useSelector((state: RootState) => state.employees);

    const currentTasks = activeTab === 'Open' ? openTasks : completedTasks;
    const currentPagination = activeTab === 'Open' ? openPagination : completedPagination;

    // Fetch employees for filter dropdown on mount
    useEffect(() => {
        // Only fetch if employee list isn't already populated (basic check)
        if (employeeList.length === 0) {
            dispatch(fetchEmployees());
        }
    }, [dispatch, employeeList.length]);


    // Fetch tasks when tab or filter changes
    useEffect(() => {
        dispatch(fetchAdminTasks({ status: activeTab, page: 1, assigneeId: filterAssigneeId || undefined }));
    }, [dispatch, activeTab, filterAssigneeId]);

     // Clear error on mount/unmount or when modal closes
    useEffect(() => {
        return () => { dispatch(clearAdminTaskError()); }
    }, [dispatch]);
    useEffect(() => { if (!isModalOpen) dispatch(clearAdminTaskError()); }, [isModalOpen, dispatch]);


    const loadMoreTasks = () => {
        if (currentPagination.currentPage < currentPagination.totalPages) {
            dispatch(fetchAdminTasks({ status: activeTab, page: currentPagination.currentPage + 1, assigneeId: filterAssigneeId || undefined }));
        }
    };

    const handleOpenModal = (task: Task | null = null) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTaskToEdit(null);
    };

    const handleSubmitTask = async (data: TaskFormData | AdminTaskFormData) => { /* ... same submit logic ... */ };
    const handleStatusChange = (taskId: string, newStatus: TaskStatus) => { /* ... same status change logic ... */ };
    const handleDelete = (taskId: string, taskName: string) => { /* ... same delete logic ... */ };

    // Define getTabClass INSIDE the component
    const getTabClass = (tabName: TaskTab) => {
         return `py-3 px-5 text-sm font-medium text-center border-b-2 cursor-pointer transition-colors duration-150 ease-in-out flex items-center space-x-2 ${
            activeTab === tabName
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`;
    };

    return (
        <div className="space-y-6">
             {/* ... Header and Create Button ... */}
             <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Task Administration</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-primary w-full sm:w-auto">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Create Task
                </button>
            </div>


            {/* Filter Section */}
            <div className="bg-white p-3 rounded-md shadow-sm border flex items-center gap-4">
                 <Filter size={18} className="text-gray-500"/>
                 <label htmlFor="assigneeFilter" className="text-sm font-medium text-gray-600">Filter by Assignee:</label>
                 <select
                    id="assigneeFilter"
                    value={filterAssigneeId}
                    onChange={(e) => setFilterAssigneeId(e.target.value)}
                    className="input py-1 text-sm flex-grow max-w-xs"
                    disabled={employeesLoading} // Disable while loading employees
                 >
                    <option value="">All Employees</option>
                    {employeesLoading ? (
                        <option disabled>Loading...</option>
                    ) : (
                         employeeList.map(emp => (
                            // Use ObjectId for filtering value
                            <option key={emp._id} value={emp._id}>{emp.employeeInfo.name} ({emp.employeeInfo.employeeId})</option>
                        ))
                    )}
                 </select>
                 {filterAssigneeId && (
                     <button onClick={() => setFilterAssigneeId('')} className="text-xs text-gray-500 hover:text-red-600 flex items-center">
                        <ClearFilterIcon size={14} className="mr-1"/> Clear Filter
                     </button>
                 )}
            </div>

             {/* Tabs - Removed totalTasks display */}
             <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {/* Call getTabClass correctly */}
                    <button onClick={() => setActiveTab('Open')} className={getTabClass('Open')}>
                        <ListTodo size={18} /><span>Open</span>
                    </button>
                    <button onClick={() => setActiveTab('Completed')} className={getTabClass('Completed')}>
                        <ListChecks size={18} /><span>Completed</span>
                    </button>
                </nav>
            </div>

            {/* Task List */}
            <TaskList
                tasks={currentTasks}
                status={activeTab}
                loading={loading}
                pagination={currentPagination}
                loadMore={loadMoreTasks}
                onEdit={handleOpenModal}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                isAdmin={true}
            />

            {/* Form Modal */}
             <TaskFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmitTask={handleSubmitTask}
                taskToEdit={taskToEdit}
                isAdmin={true}
                actionLoading={actionLoading}
                error={error}
             />
        </div>
    );
}