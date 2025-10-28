// src/lib/redux/slices/employeeTaskSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';
import { Task, TaskListResponse, TaskFormData, TaskStatus } from '../../../types';

interface EmployeeTaskState {
  openTasks: Task[];
  completedTasks: Task[];
  openPagination: { currentPage: number, totalPages: number };
  completedPagination: { currentPage: number, totalPages: number };
  loading: boolean;
  actionLoading: boolean; // For create/update/status change
  error: string | null;
}

const initialState: EmployeeTaskState = {
  openTasks: [],
  completedTasks: [],
  openPagination: { currentPage: 1, totalPages: 1 },
  completedPagination: { currentPage: 1, totalPages: 1 },
  loading: false,
  actionLoading: false,
  error: null,
};


const processTaskData = (data: TaskFormData) => ({
    ...data,
   
    tags: data.tags ? data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [],
});

// --- Thunks ---
export const fetchMyTasks = createAsyncThunk(
  'employeeTasks/fetchMyTasks',
  async ({ status, page = 1 }: { status: TaskStatus, page?: number }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/employee/tasks?status=${status}&page=${page}&limit=10`);
      return { status, data: data as TaskListResponse };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || `Failed to fetch ${status.toLowerCase()} tasks`);
    }
  }
);

export const createMyTask = createAsyncThunk(
  'employeeTasks/create',
  async (taskData: TaskFormData, { rejectWithValue }) => {
    try {
      const processedData = processTaskData(taskData);
      const { data } = await api.post('/employee/tasks', processedData);
      return data as Task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  }
);

export const updateMyTask = createAsyncThunk(
  'employeeTasks/update',
  async ({ taskId, taskData }: { taskId: string, taskData: TaskFormData }, { rejectWithValue }) => {
    try {
       const processedData = processTaskData(taskData);
      const { data } = await api.put(`/employee/tasks/${taskId}`, processedData);
      return data as Task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

export const updateMyTaskStatus = createAsyncThunk(
  'employeeTasks/updateStatus',
  async ({ taskId, status }: { taskId: string, status: TaskStatus }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/employee/tasks/${taskId}/status`, { status });
      return data as Task; // Return the updated task
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task status');
    }
  }
);


// --- Slice ---
const employeeTaskSlice = createSlice({
  name: 'employeeTasks',
  initialState,
  reducers: {
      clearEmployeeTaskError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchMyTasks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyTasks.fulfilled, (state, action) => {
          state.loading = false;
          const { status, data } = action.payload;
          const pagination = { currentPage: data.currentPage, totalPages: data.totalPages };
          if (status === 'Open') {
              state.openTasks = data.currentPage === 1 ? data.tasks : [...state.openTasks, ...data.tasks];
              state.openPagination = pagination;
          } else {
              state.completedTasks = data.currentPage === 1 ? data.tasks : [...state.completedTasks, ...data.tasks];
              state.completedPagination = pagination;
          }
      })
      .addCase(fetchMyTasks.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      // Create Task
      .addCase(createMyTask.pending, (state) => { state.actionLoading = true; state.error = null; })
      .addCase(createMyTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.actionLoading = false;
        state.openTasks.unshift(action.payload); // Add new task to the top of open list
      })
      .addCase(createMyTask.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; })

      // Update Task (Details)
      .addCase(updateMyTask.pending, (state) => { state.actionLoading = true; state.error = null; })
      .addCase(updateMyTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.actionLoading = false;
        // Update task in the 'Open' list (only open tasks can be edited this way)
        const index = state.openTasks.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
            state.openTasks[index] = action.payload;
        }
      })
      .addCase(updateMyTask.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; })

       // Update Task Status
      .addCase(updateMyTaskStatus.pending, (state) => { state.actionLoading = true; state.error = null; })
      .addCase(updateMyTaskStatus.fulfilled, (state, action: PayloadAction<Task>) => {
        state.actionLoading = false;
        const updatedTask = action.payload;
        // Remove from one list and add to the other
        state.openTasks = state.openTasks.filter(t => t._id !== updatedTask._id);
        state.completedTasks = state.completedTasks.filter(t => t._id !== updatedTask._id);
        if (updatedTask.status === 'Open') {
            state.openTasks.unshift(updatedTask); // Add to top of open
        } else {
            state.completedTasks.unshift(updatedTask); // Add to top of completed
        }
      })
      .addCase(updateMyTaskStatus.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload as string; });
  },
});

export const { clearEmployeeTaskError } = employeeTaskSlice.actions;
export default employeeTaskSlice.reducer;