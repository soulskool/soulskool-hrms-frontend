// src/lib/redux/slices/adminTaskSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';
import { Task, TaskListResponse, AdminTaskFormData, TaskStatus, TaskFormData } from '../../../types';

interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalTasks: number; // Added totalTasks
}

interface AdminTaskState {
  openTasks: Task[];
  completedTasks: Task[];
  openPagination: PaginationInfo; // Use the explicit type
  completedPagination: PaginationInfo; // Use the explicit type
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: AdminTaskState = {
  openTasks: [],
  completedTasks: [],
  // CORRECTED: Initialize pagination fully including totalTasks
  openPagination: { currentPage: 1, totalPages: 1, totalTasks: 0 },
  completedPagination: { currentPage: 1, totalPages: 1, totalTasks: 0 },
  loading: false,
  actionLoading: false,
  error: null,
};
// Helper to process tags
const processTaskData = (data: TaskFormData | AdminTaskFormData) => ({
    ...data,
    tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
});

// --- Thunks ---
export const fetchAdminTasks = createAsyncThunk(
  'adminTasks/fetchAll',
  async ({ status, page = 1, assigneeId }: { status: TaskStatus, page?: number, assigneeId?: string }, { rejectWithValue }) => {
    try {
      let url = `/admin/tasks?status=${status}&page=${page}&limit=10`;
      if (assigneeId) {
          url += `&assigneeId=${assigneeId}`;
      }
      const { data } = await api.get(url);
      return { status, data: data as TaskListResponse };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || `Failed to fetch ${status.toLowerCase()} tasks`);
    }
  }
);

export const adminCreateTask = createAsyncThunk(
  'adminTasks/create',
  async (taskData: AdminTaskFormData, { rejectWithValue }) => {
    try {
      const processedData = processTaskData(taskData);
      const { data } = await api.post('/admin/tasks', processedData);
      return data as Task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  }
);

export const adminUpdateTask = createAsyncThunk(
  'adminTasks/update',
  async ({ taskId, taskData }: { taskId: string, taskData: AdminTaskFormData }, { rejectWithValue }) => {
    try {
       const processedData = processTaskData(taskData);
      const { data } = await api.put(`/admin/tasks/${taskId}`, processedData);
      return data as Task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

export const adminUpdateTaskStatus = createAsyncThunk(
  'adminTasks/updateStatus',
  async ({ taskId, status }: { taskId: string, status: TaskStatus }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/admin/tasks/${taskId}/status`, { status });
      return data as Task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task status');
    }
  }
);

export const adminDeleteTask = createAsyncThunk(
  'adminTasks/delete',
  async (taskId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/tasks/${taskId}`);
      return taskId; // Return ID of deleted task
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
    }
  }
);

const adminTaskSlice = createSlice({
  name: 'adminTasks',
  initialState,
  reducers: {
      clearAdminTaskError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchAdminTasks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAdminTasks.fulfilled, (state, action) => {
          state.loading = false;
          const { status, data } = action.payload;
          // Create the full pagination object including totalTasks
          const pagination: PaginationInfo = {
              currentPage: data.currentPage,
              totalPages: data.totalPages,
              totalTasks: data.totalTasks
          };
           if (status === 'Open') {
              state.openTasks = data.currentPage === 1 ? data.tasks : [...state.openTasks, ...data.tasks];
              state.openPagination = pagination; // Assign the full pagination object
          } else {
              state.completedTasks = data.currentPage === 1 ? data.tasks : [...state.completedTasks, ...data.tasks];
              state.completedPagination = pagination; // Assign the full pagination object
          }
      })
      .addCase(fetchAdminTasks.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

       // Create Task - Update total count for the 'Open' tab
      .addCase(adminCreateTask.pending, (state) => { state.actionLoading = true; state.error = null; })
      .addCase(adminCreateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.actionLoading = false;
        state.openTasks.unshift(action.payload);
        state.openPagination.totalTasks += 1; // Increment total open tasks
      })
      .addCase(adminCreateTask.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; })

      // Update Task (Details) - No change needed for pagination counts here
      .addCase(adminUpdateTask.pending, (state) => { /* ... */ })
      .addCase(adminUpdateTask.fulfilled, (state, action: PayloadAction<Task>) => { /* ... */ })
      .addCase(adminUpdateTask.rejected, (state, action) => { /* ... */ })

      // Update Task Status - Adjust total counts for both tabs
      .addCase(adminUpdateTaskStatus.pending, (state) => { state.actionLoading = true; state.error = null; })
      .addCase(adminUpdateTaskStatus.fulfilled, (state, action: PayloadAction<Task>) => {
        state.actionLoading = false;
        const updatedTask = action.payload;
        // Remove from both lists first
        const wasOpen = state.openTasks.some(t => t._id === updatedTask._id);
        const wasCompleted = state.completedTasks.some(t => t._id === updatedTask._id);
        state.openTasks = state.openTasks.filter(t => t._id !== updatedTask._id);
        state.completedTasks = state.completedTasks.filter(t => t._id !== updatedTask._id);

        if (updatedTask.status === 'Open') {
            state.openTasks.unshift(updatedTask);
            state.openPagination.totalTasks += 1; // Increment open count
            if(wasCompleted) state.completedPagination.totalTasks -= 1; // Decrement completed count only if it was there
        } else { // Completed
            state.completedTasks.unshift(updatedTask);
            state.completedPagination.totalTasks += 1; // Increment completed count
             if(wasOpen) state.openPagination.totalTasks -= 1; // Decrement open count only if it was there
        }
        // Ensure counts don't go below zero
        if (state.openPagination.totalTasks < 0) state.openPagination.totalTasks = 0;
        if (state.completedPagination.totalTasks < 0) state.completedPagination.totalTasks = 0;
      })
      .addCase(adminUpdateTaskStatus.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; })

       // Delete Task - Decrement count for the correct tab
      .addCase(adminDeleteTask.pending, (state) => { state.actionLoading = true; state.error = null; })
      .addCase(adminDeleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.actionLoading = false;
        const taskId = action.payload;
        // Check which list it was in to decrement the correct counter
        const wasOpen = state.openTasks.some(t => t._id === taskId);
        state.openTasks = state.openTasks.filter(t => t._id !== taskId);
        state.completedTasks = state.completedTasks.filter(t => t._id !== taskId);
        if (wasOpen) {
            state.openPagination.totalTasks -= 1;
        } else {
            state.completedPagination.totalTasks -= 1;
        }
         // Ensure counts don't go below zero
        if (state.openPagination.totalTasks < 0) state.openPagination.totalTasks = 0;
        if (state.completedPagination.totalTasks < 0) state.completedPagination.totalTasks = 0;
      })
      .addCase(adminDeleteTask.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; });
  },
});

export const { clearAdminTaskError } = adminTaskSlice.actions;
export default adminTaskSlice.reducer;