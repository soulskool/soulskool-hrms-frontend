// src/app/(employee)/employee/tasks/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../lib/redux/store';
import { fetchMyTasks, createMyTask, updateMyTask, updateMyTaskStatus, clearEmployeeTaskError } from '../../../../lib/redux/slices/employeeTaskSlice';
import TaskList from '../../../../components/tasks/TaskList';
import TaskFormModal from '../../../../components/tasks/TaskFormModal';
import { Task, TaskFormData, TaskStatus } from '../../../../types';
import { PlusCircle, ListTodo, ListChecks } from 'lucide-react';
import toast from 'react-hot-toast';

type TaskTab = 'Open' | 'Completed';

export default function EmployeeTasksPage() {
    const dispatch = useDispatch<AppDispatch>();
    const [activeTab, setActiveTab] = useState<TaskTab>('Open');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

    const {
        openTasks, completedTasks, openPagination, completedPagination, loading, actionLoading, error
    } = useSelector((state: RootState) => state.employeeTasks);

    const currentTasks = activeTab === 'Open' ? openTasks : completedTasks;
    const currentPagination = activeTab === 'Open' ? openPagination : completedPagination;

    // Fetch tasks when tab changes or component mounts
    useEffect(() => {
        dispatch(fetchMyTasks({ status: activeTab, page: 1 }));
    }, [dispatch, activeTab]);

    // Clear error on mount/unmount or when modal closes
    useEffect(() => {
        return () => { dispatch(clearEmployeeTaskError()); }
    }, [dispatch]);
    useEffect(() => { if (!isModalOpen) dispatch(clearEmployeeTaskError()); }, [isModalOpen, dispatch]);

    const loadMoreTasks = () => {
        if (currentPagination.currentPage < currentPagination.totalPages) {
            dispatch(fetchMyTasks({ status: activeTab, page: currentPagination.currentPage + 1 }));
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

    // Wrapper for thunk dispatch in the modal
    const handleSubmitTask = async (data: TaskFormData) => {
        let resultAction;
        if (taskToEdit) {
            resultAction = await dispatch(updateMyTask({ taskId: taskToEdit._id, taskData: data }));
            if (updateMyTask.fulfilled.match(resultAction)) toast.success("Task updated!");
        } else {
            resultAction = await dispatch(createMyTask(data));
             if (createMyTask.fulfilled.match(resultAction)) toast.success("Task created!");
        }

        // Re-throw error for modal to catch if rejected
        if (resultAction.meta.requestStatus === 'rejected') {
            throw new Error(resultAction.payload as string);
        }
    };

    const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
         dispatch(updateMyTaskStatus({ taskId, status: newStatus }))
            .unwrap()
            .then(() => toast.success(`Task marked as ${newStatus.toLowerCase()}!`))
            .catch((err) => toast.error(err || 'Failed to update status'));
    };


    const getTabClass = (tabName: TaskTab) => {
         return `py-3 px-5 text-sm font-medium text-center border-b-2 cursor-pointer transition-colors duration-150 ease-in-out flex items-center space-x-2 ${
            activeTab === tabName
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`;
    };


    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Tasks</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-primary w-full sm:w-auto">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Create Task
                </button>
            </div>

             {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
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
                isAdmin={false} // Employee view
            />

            {/* Form Modal */}
             <TaskFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmitTask={handleSubmitTask}
                taskToEdit={taskToEdit}
                isAdmin={false} // Employee form
                actionLoading={actionLoading}
                error={error} // Pass Redux error to modal
             />
        </div>
    );
}