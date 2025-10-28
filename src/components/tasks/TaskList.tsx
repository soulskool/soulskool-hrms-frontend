// // src/components/tasks/TaskList.tsx
// "use client";

// import { Task, TaskStatus } from '../../types';
// import { Loader2, ChevronDown, Check, RefreshCcw, Edit, Trash2 } from 'lucide-react';

// // Props definition
// interface TaskListProps {
//   tasks: Task[];
//   status: TaskStatus; // 'Open' or 'Completed'
//   loading: boolean;
//   pagination: { currentPage: number, totalPages: number };
//   loadMore: () => void;
//   onEdit: (task: Task) => void;
//   onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
//   onDelete?: (taskId: string, taskName: string) => void; // Optional delete for admin
//   isAdmin: boolean;
// }

// // Helper for priority badge styling
// const getPriorityBadgeClass = (priority: string) => {
//     switch (priority) {
//         case 'High': return 'bg-red-100 text-red-700';
//         case 'Medium': return 'bg-yellow-100 text-yellow-700';
//         case 'Low': return 'bg-blue-100 text-blue-700';
//         default: return 'bg-gray-100 text-gray-700';
//     }
// }

// // Helper for due date display and styling
// const formatDueDate = (isoString?: string): { text: string; isPast: boolean } => {
//     if (!isoString) return { text: '-', isPast: false };
//     try {
//         const dueDate = new Date(isoString);
//         const today = new Date();
//         today.setHours(0,0,0,0); // Compare date part only
//         dueDate.setHours(0,0,0,0);

//         const isPast = dueDate < today;
//         const text = dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
//         return { text, isPast };
//     } catch (e) {
//         return { text: 'Invalid', isPast: false };
//     }
// };


// export default function TaskList({
//     tasks, status, loading, pagination, loadMore, onEdit, onStatusChange, onDelete, isAdmin
// }: TaskListProps) {

//     const handleStatusToggle = (task: Task) => {
//         const newStatus: TaskStatus = task.status === 'Open' ? 'Completed' : 'Open';
//         onStatusChange(task._id, newStatus);
//     };

//     const confirmAndDelete = (task: Task) => {
//         if (onDelete && window.confirm(`Are you sure you want to delete the task "${task.taskName}"? This action cannot be undone.`)) {
//             onDelete(task._id, task.taskName);
//         }
//     };


//     if (loading && pagination.currentPage === 1) {
//         return <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;
//     }

//     if (!loading && tasks.length === 0) {
//         return <p className="text-gray-500 text-sm text-center py-10 italic">No {status.toLowerCase()} tasks found.</p>;
//     }

//     return (
//         <div className="space-y-3">
//             {tasks.map((task) => {
//                 const dueDateInfo = formatDueDate(task.dueDate);
//                 return (
//                     <div key={task._id} className="border rounded-md p-4 bg-white shadow-sm hover:shadow transition group">
//                         <div className="flex justify-between items-start gap-2 mb-2">
//                            {/* Task Name and Assignee (if admin) */}
//                            <div className="flex-1 min-w-0">
//                              <p className="font-semibold text-gray-800 text-base truncate" title={task.taskName}>{task.taskName}</p>
//                              {isAdmin && (
//                                 <p className="text-xs text-gray-500">
//                                     Assigned to: {task.assigneeName} ({task.assigneeEmployeeId})
//                                 </p>
//                              )}
//                            </div>
//                            {/* Priority and Due Date */}
//                             <div className="flex-shrink-0 flex items-center space-x-3 text-xs">
//                                 <span className={`px-2 py-0.5 font-medium rounded-full ${getPriorityBadgeClass(task.priority)}`}>
//                                     {task.priority}
//                                 </span>
//                                 {task.dueDate && (
//                                      <span className={`font-medium ${dueDateInfo.isPast && task.status === 'Open' ? 'text-red-600' : 'text-gray-500'}`}>
//                                         Due: {dueDateInfo.text}
//                                     </span>
//                                 )}

//                             </div>
//                         </div>

//                         {/* Description */}
//                         {task.description && (
//                             <p className="text-sm text-gray-600 mb-3 line-clamp-2 group-hover:line-clamp-none transition-[display]"> {/* Expand on hover */}
//                                 {task.description}
//                             </p>
//                         )}

//                         {/* Tags */}
//                         {task.tags && task.tags.length > 0 && (
//                             <div className="flex flex-wrap gap-1 mb-3">
//                                 {task.tags.map(tag => (
//                                      <span key={tag} className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">#{tag}</span>
//                                 ))}
//                             </div>
//                         )}

//                         {/* Actions */}
//                         <div className="flex justify-end items-center space-x-2 pt-2 border-t border-gray-100">
//                             {/* Status Toggle Button */}
//                             <button
//                                 onClick={() => handleStatusToggle(task)}
//                                 className={`p-1 rounded text-xs flex items-center space-x-1 transition-colors ${
//                                     task.status === 'Open'
//                                     ? 'text-green-600 hover:bg-green-50'
//                                     : 'text-orange-600 hover:bg-orange-50'
//                                 }`}
//                                 title={task.status === 'Open' ? 'Mark as Completed' : 'Reopen Task'}
//                             >
//                                 {task.status === 'Open' ? <Check size={14}/> : <RefreshCcw size={14}/>}
//                                 <span>{task.status === 'Open' ? 'Complete' : 'Reopen'}</span>
//                             </button>
//                              {/* Edit Button (Only for Open Tasks) */}
//                              {task.status === 'Open' && (
//                                 <button
//                                     onClick={() => onEdit(task)}
//                                     className="p-1 rounded text-blue-600 hover:bg-blue-50 transition-colors" title="Edit Task"
//                                 >
//                                     <Edit size={14}/>
//                                 </button>
//                              )}
//                               {/* Delete Button (Admin Only) */}
//                             {isAdmin && onDelete && (
//                                 <button
//                                     onClick={() => confirmAndDelete(task)}
//                                     className="p-1 rounded text-red-600 hover:bg-red-50 transition-colors" title="Delete Task"
//                                 >
//                                     <Trash2 size={14}/>
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 );
//             })}

//              {/* Load More Button */}
//             {pagination.currentPage < pagination.totalPages && (
//                 <div className="pt-4 text-center">
//                     <button
//                         onClick={loadMore}
//                         disabled={loading} // Disable if currently loading the next page
//                         className="btn-secondary text-sm flex items-center justify-center mx-auto disabled:opacity-50"
//                     >
//                         {loading ? <Loader2 className="animate-spin mr-2" size={16}/> : <ChevronDown size={16} className="mr-1"/>}
//                         {loading ? 'Loading...' : 'Load More'}
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// }
















// src/components/tasks/TaskList.tsx
"use client";

import { Task, TaskStatus } from '../../types';
import { Loader2, ChevronDown, Check, RefreshCcw, Edit, Trash2 } from 'lucide-react';

// Props definition remains the same
interface TaskListProps {
  tasks: Task[];
  status: TaskStatus;
  loading: boolean;
  pagination: { currentPage: number, totalPages: number };
  loadMore: () => void;
  onEdit: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete?: (taskId: string, taskName: string) => void;
  isAdmin: boolean;
}

// Helper functions remain the same

const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
        case 'High': return 'bg-red-100 text-red-700';
        case 'Medium': return 'bg-yellow-100 text-yellow-700';
        case 'Low': return 'bg-blue-100 text-blue-700';
        default: return 'bg-gray-100 text-gray-700';
    }
}

// Helper for due date display and styling
const formatDueDate = (isoString?: string): { text: string; isPast: boolean } => {
    if (!isoString) return { text: '-', isPast: false };
    try {
        const dueDate = new Date(isoString);
        const today = new Date();
        today.setHours(0,0,0,0); // Compare date part only
        dueDate.setHours(0,0,0,0);

        const isPast = dueDate < today;
        const text = dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        return { text, isPast };
    } catch (e) {
        return { text: 'Invalid', isPast: false };
    }
};

export default function TaskList({
    tasks, status, loading, pagination, loadMore, onEdit, onStatusChange, onDelete, isAdmin
}: TaskListProps) {

    const handleStatusToggle = (task: Task) => {
        const newStatus: TaskStatus = task.status === 'Open' ? 'Completed' : 'Open';
        onStatusChange(task._id, newStatus);
    };

    const confirmAndDelete = (task: Task) => {
        if (onDelete && window.confirm(`Are you sure you want to delete the task "${task.taskName}"? This action cannot be undone.`)) {
            onDelete(task._id, task.taskName);
        }
    };

    // Show main loader only on initial load (page 1)
    if (loading && pagination.currentPage === 1) {
        return <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;
    }

    // Show empty state if no tasks and not loading
    if (!loading && tasks.length === 0) {
        return <p className="text-gray-500 text-sm text-center py-10 italic">No {status.toLowerCase()} tasks found.</p>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100/50">
                        <tr>
                            {isAdmin && (
                                <>
                                    <th scope="col" className="px-5 py-3">Assignee</th>
                                    <th scope="col" className="px-5 py-3 hidden lg:table-cell">Employee ID</th>
                                </>
                            )}
                            <th scope="col" className="px-5 py-3">Task Name</th>
                            <th scope="col" className="px-5 py-3 hidden md:table-cell">Priority</th>
                            <th scope="col" className="px-5 py-3 hidden sm:table-cell">Due Date</th>
                            <th scope="col" className="px-5 py-3 hidden xl:table-cell">Tags</th>
                            <th scope="col" className="px-5 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {tasks.map((task) => {
                            const dueDateInfo = formatDueDate(task.dueDate);
                            return (
                                <tr key={task._id} className="bg-white hover:bg-gray-50/50 transition-colors">
                                    {isAdmin && (
                                        <>
                                            <td className="px-5 py-3 font-medium text-gray-900 whitespace-nowrap">{task.assigneeName}</td>
                                            <td className="px-5 py-3 hidden lg:table-cell whitespace-nowrap">{task.assigneeEmployeeId}</td>
                                        </>
                                    )}
                                    <td className={`px-5 py-3 font-medium ${!isAdmin ? 'text-gray-900' : ''} whitespace-normal max-w-xs`}>
                                        {task.taskName}
                                        {task.description && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{task.description}</p>}
                                    </td>
                                    <td className="px-5 py-3 hidden md:table-cell">
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getPriorityBadgeClass(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className={`px-5 py-3 hidden sm:table-cell whitespace-nowrap ${dueDateInfo.isPast && task.status === 'Open' ? 'text-red-600 font-medium' : ''}`}>
                                        {dueDateInfo.text}
                                    </td>
                                    <td className="px-5 py-3 hidden xl:table-cell">
                                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                                            {task.tags?.slice(0, 3).map(tag => ( // Show max 3 tags
                                                 <span key={tag} className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded whitespace-nowrap">#{tag}</span>
                                            ))}
                                            {task.tags?.length > 3 && <span className="text-xs text-gray-400">...</span>}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end space-x-2">
                                            {/* Status Toggle Button */}
                                            <button
                                                onClick={() => handleStatusToggle(task)}
                                                className={`p-1 rounded text-xs flex items-center space-x-1 transition-colors ${
                                                    task.status === 'Open'
                                                    ? 'text-green-600 hover:bg-green-50'
                                                    : 'text-orange-600 hover:bg-orange-50'
                                                }`}
                                                title={task.status === 'Open' ? 'Mark as Completed' : 'Reopen Task'}
                                            >
                                                {task.status === 'Open' ? <Check size={14}/> : <RefreshCcw size={14}/>}
                                            </button>
                                             {/* Edit Button (Only for Open Tasks) */}
                                             {task.status === 'Open' && (
                                                <button
                                                    onClick={() => onEdit(task)}
                                                    className="p-1 rounded text-blue-600 hover:bg-blue-50 transition-colors" title="Edit Task"
                                                >
                                                    <Edit size={14}/>
                                                </button>
                                             )}
                                              {/* Delete Button (Admin Only) */}
                                            {isAdmin && onDelete && (
                                                <button
                                                    onClick={() => confirmAndDelete(task)}
                                                    className="p-1 rounded text-red-600 hover:bg-red-50 transition-colors" title="Delete Task"
                                                >
                                                    <Trash2 size={14}/>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Load More Button - outside the table div */}
            {pagination.currentPage < pagination.totalPages && (
                <div className="p-4 border-t text-center bg-white rounded-b-lg">
                    <button
                        onClick={loadMore}
                        disabled={loading} // Disable only if loading the next page specifically
                        className="btn-secondary text-sm flex items-center justify-center mx-auto disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" size={16}/> : <ChevronDown size={16} className="mr-1"/>}
                        {loading ? 'Loading...' : 'Load More Tasks'}
                    </button>
                </div>
            )}
        </div>
    );
}