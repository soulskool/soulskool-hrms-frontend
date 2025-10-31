// src/components/tasks/TaskFormModal.tsx
"use client";

import { useEffect } from 'react';
import { useForm, SubmitHandler, Controller, FieldErrors } from 'react-hook-form'; // Import FieldErrors
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeTaskSchema, EmployeeTaskSchema, adminTaskSchema, AdminTaskSchema, } from '../../lib/validation/taskSchema';
import { Task, TaskFormData, AdminTaskFormData, TaskPriority, Employee } from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../lib/redux/store';
import { Loader2, Save, X, Tag, Calendar, MessageSquare, User } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmitTask: (data: TaskFormData | AdminTaskFormData) => Promise<any>; // Thunk action
  taskToEdit?: Task | null;
  isAdmin: boolean;
  actionLoading: boolean;
  error?: string | null;

  // NEW PROPS for Admin mode
  employeeList?: Employee[];
  employeesLoading?: boolean;
}

// Define a union type for the form data based on isAdmin
type FormSchema = AdminTaskSchema | EmployeeTaskSchema;

export default function TaskFormModal({ isOpen, onClose, onSubmitTask, taskToEdit, isAdmin, actionLoading, error, employeeList = [], employeesLoading = false }: Props) {
    const isEditMode = Boolean(taskToEdit);
    // Use the correct schema based on isAdmin flag for validation
    const schema = isAdmin ? adminTaskSchema : employeeTaskSchema;

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormSchema>({ // Use the union type here
        resolver: zodResolver(schema),
        defaultValues: {
            taskName: '',
            description: '',
            priority: 'Medium',
            dueDate: '',
            tags: '',
            // Conditionally set default for assigneeEmployeeId only if isAdmin
            ...(isAdmin && { assigneeEmployeeId: '' })
        }
    });

    // Populate form when taskToEdit changes
    useEffect(() => {
        if (isOpen) {
             if (isEditMode && taskToEdit) {
                const defaultData: Partial<FormSchema> = { // Use partial of the union type
                    taskName: taskToEdit.taskName,
                    description: taskToEdit.description || '',
                    priority: taskToEdit.priority,
                    dueDate: taskToEdit.dueDate ? taskToEdit.dueDate.split('T')[0] : '',
                    tags: taskToEdit.tags.join(', '),
                };
                // Add assignee ONLY if isAdmin is true
                if (isAdmin) {
                    (defaultData as AdminTaskSchema).assigneeEmployeeId = taskToEdit.assigneeEmployeeId;
                }
                reset(defaultData);
            } else {
                 // Reset to defaults for create mode
                 reset({
                    taskName: '', description: '', priority: 'Medium', dueDate: '', tags: '',
                    ...(isAdmin && { assigneeEmployeeId: '' })
                 });
            }
        }
    }, [taskToEdit, isEditMode, isOpen, reset, isAdmin]);

    const onSubmit: SubmitHandler<FormSchema> = (data) => {
        onSubmitTask(data) // Pass the data directly (it will match either AdminTaskFormData or TaskFormData)
            .then(() => {
                 onClose();
            })
            .catch(() => {
                 // Error handled by parent/slice
            });
    };



    if (!isOpen) return null;

    // Type assertion for accessing admin-specific errors
    const adminErrors = errors as FieldErrors<AdminTaskSchema>;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">{isEditMode ? 'Edit Task' : 'Create New Task'}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {error && <p className='text-red-500 text-sm'>{error}</p>}

              {/* Task Name */}
              <div>
                <label htmlFor="taskName" className="form-label flex items-center"><User size={14} className="mr-1"/>Task Name*</label>
                <input id="taskName" {...register("taskName")} className={`input ${errors.taskName ? 'border-red-500' : ''}`} placeholder="Enter task title..." />
                {errors.taskName && <p className="error-text">{errors.taskName.message}</p>}
              </div>

             {/* Assignee (Admin only) */}
             {isAdmin && (
                  // <div>
                  //   <label htmlFor="assigneeEmployeeId" className="form-label flex items-center"><User size={14} className="mr-1"/>Assign To (Employee ID)*</label>
                  //   <input
                  //       id="assigneeEmployeeId"
                  //       // Register using the specific admin type path
                  //       {...register("assigneeEmployeeId" as keyof AdminTaskSchema)}
                  //       // Check errors using the asserted adminErrors type
                  //       className={`input ${adminErrors.assigneeEmployeeId ? 'border-red-500' : ''}`}
                  //       placeholder="Enter Employee ID..."
                  //   />
                  //    {/* Access errors using the asserted adminErrors type */}
                  //    {adminErrors.assigneeEmployeeId && <p className="error-text">{adminErrors.assigneeEmployeeId.message}</p>}
                  // </div>

                <>
                    <label htmlFor="assigneeEmployeeId" className="form-label flex items-center"><User size={14} className="mr-1"/>Assign To (Employee ID)*</label>
                    <select
                        id="assigneeEmployeeId"
                        // Register using the specific admin type path
                        {...register("assigneeEmployeeId" as keyof AdminTaskSchema)}
                        // Check errors using the asserted adminErrors type
                        className={`input ${adminErrors.assigneeEmployeeId ? 'border-red-500' : ''}`}
                        disabled={employeesLoading}
                    >
                         <option value="">{employeesLoading ? 'Loading employees...' : 'Select Employee...'}</option>
                         {employeeList.map(emp => (
                             // IMPORTANT: We use the Employee ID string here, as the backend logic relies on it to find the MongoDB ObjectId
                            <option key={emp.employeeInfo.employeeId} value={emp.employeeInfo.employeeId}>
                                {emp.employeeInfo.name} ({emp.employeeInfo.employeeId})
                            </option>
                        ))}
                    </select>
                     {/* Access errors using the asserted adminErrors type */}
                     {adminErrors.assigneeEmployeeId && <p className="error-text">{adminErrors.assigneeEmployeeId.message}</p>}
                  </>


             )}


              {/* Description */}
              <div>
                <label htmlFor="description" className="form-label flex items-center"><MessageSquare size={14} className="mr-1"/>Description</label>
                <textarea id="description" {...register("description")} rows={3} className={`input ${errors.description ? 'border-red-500' : ''}`} placeholder="Add more details..."></textarea>
                 {errors.description && <p className="error-text">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Priority */}
                <div>
                  <label htmlFor="priority" className="form-label">Priority</label>
                  <select id="priority" {...register("priority")} className="input">
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                    <option value="High">High</option>
                  </select>
                   {/* Errors for priority if needed */}
                   {errors.priority && <p className="error-text">{errors.priority.message}</p>}
                </div>

                {/* Due Date */}
                <div>
                  <label htmlFor="dueDate" className="form-label flex items-center"><Calendar size={14} className="mr-1"/>Due Date</label>
                  <input id="dueDate" type="date" {...register("dueDate")} className="input" />
                   {errors.dueDate && <p className="error-text">{errors.dueDate.message}</p>}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="form-label flex items-center"><Tag size={14} className="mr-1"/>Tags (comma-separated)</label>
                <input id="tags" {...register("tags")} className="input" placeholder="e.g., report, urgent, client-project"/>
                 {errors.tags && <p className="error-text">{errors.tags.message}</p>}
              </div>


              <div className="pt-4 flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="btn-secondary" disabled={actionLoading}>Cancel</button>
                <button type="submit" disabled={actionLoading} className="btn-primary flex items-center space-x-2">
                    {actionLoading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
                    <span>{actionLoading ? 'Saving...' : (isEditMode ? 'Update Task' : 'Create Task')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      );
}