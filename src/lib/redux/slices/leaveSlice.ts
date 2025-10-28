// src/lib/redux/slices/leaveSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';
import { LeaveBalance, LeaveApplyFormData, LeaveRequest, LeaveRequestListResponse } from '../../../types';

interface LeaveState {
  balance: LeaveBalance | null;
  pendingRequests: LeaveRequest[];
  historyRequests: LeaveRequest[];
  pendingPagination: { currentPage: number, totalPages: number, totalRequests: number };
  historyPagination: { currentPage: number, totalPages: number, totalRequests: number };
  loadingBalance: boolean;
  loadingRequests: boolean;
  loadingAction: boolean; // For applying leave
  error: string | null;
}

const initialState: LeaveState = {
  balance: null,
  pendingRequests: [],
  historyRequests: [],
   pendingPagination: { currentPage: 1, totalPages: 1, totalRequests: 0 },
   historyPagination: { currentPage: 1, totalPages: 1, totalRequests: 0 },
  loadingBalance: false,
  loadingRequests: false,
  loadingAction: false,
  error: null,
};

// --- Async Thunks ---

export const fetchLeaveBalance = createAsyncThunk(
  'leave/fetchBalance',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/employee/leave/balance');
      return data as LeaveBalance;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leave balance');
    }
  }
);

export const applyForLeave = createAsyncThunk(
  'leave/apply',
  async (formData: LeaveApplyFormData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/employee/leave/apply', formData);
      return data.request as LeaveRequest; // Return the newly created request
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to apply for leave');
    }
  }
);

export const fetchMyLeaveRequests = createAsyncThunk(
  'leave/fetchMyRequests',
  async ({ status, page = 1 }: { status: 'Pending' | 'History', page?: number }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/employee/leave/requests?status=${status}&page=${page}&limit=10`);
      return { status, data: data as LeaveRequestListResponse };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || `Failed to fetch ${status.toLowerCase()} requests`);
    }
  }
);


// --- Slice ---
const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
      clearLeaveError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Balance
      .addCase(fetchLeaveBalance.pending, (state) => { state.loadingBalance = true; state.error = null; })
      .addCase(fetchLeaveBalance.fulfilled, (state, action: PayloadAction<LeaveBalance>) => {
        state.loadingBalance = false;
        state.balance = action.payload;
      })
      .addCase(fetchLeaveBalance.rejected, (state, action) => { state.loadingBalance = false; state.error = action.payload as string; })

      // Apply Leave
      .addCase(applyForLeave.pending, (state) => { state.loadingAction = true; state.error = null; })
      .addCase(applyForLeave.fulfilled, (state, action: PayloadAction<LeaveRequest>) => {
        state.loadingAction = false;
        // Add to pending requests locally
        state.pendingRequests.unshift(action.payload);
        state.pendingPagination.totalRequests += 1; // Increment count
      })
      .addCase(applyForLeave.rejected, (state, action) => { state.loadingAction = false; state.error = action.payload as string; })

      // Fetch My Requests
      .addCase(fetchMyLeaveRequests.pending, (state) => { state.loadingRequests = true; state.error = null; })
      .addCase(fetchMyLeaveRequests.fulfilled, (state, action) => {
          state.loadingRequests = false;
          const { status, data } = action.payload;
          const pagination = { currentPage: data.currentPage, totalPages: data.totalPages, totalRequests: data.totalRequests };

          if (status === 'Pending') {
              // Replace pending list only if page 1, else append (basic append for now)
              state.pendingRequests = data.currentPage === 1 ? data.requests : [...state.pendingRequests, ...data.requests];
              state.pendingPagination = pagination;
          } else { // History
              state.historyRequests = data.currentPage === 1 ? data.requests : [...state.historyRequests, ...data.requests];
              state.historyPagination = pagination;
          }
      })
      .addCase(fetchMyLeaveRequests.rejected, (state, action) => { state.loadingRequests = false; state.error = action.payload as string; });
  },
});

export const { clearLeaveError } = leaveSlice.actions;
export default leaveSlice.reducer;