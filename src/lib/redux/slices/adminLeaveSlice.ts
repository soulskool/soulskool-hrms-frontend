// src/lib/redux/slices/adminLeaveSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';
import { LeaveRequest, EmployeeLeaveBalanceAdmin } from '../../../types';

interface AdminLeaveState {
  pendingRequests: LeaveRequest[];
  allBalances: EmployeeLeaveBalanceAdmin[];
  selectedEmployeeBalance: EmployeeLeaveBalanceAdmin | null; // For modal
  loadingPending: boolean;
  loadingBalances: boolean;
  loadingAction: boolean; // For approve/reject/update balance
  error: string | null;
}

const initialState: AdminLeaveState = {
  pendingRequests: [],
  allBalances: [],
  selectedEmployeeBalance: null,
  loadingPending: false,
  loadingBalances: false,
  loadingAction: false,
  error: null,
};

// --- Thunks ---

export const fetchPendingLeaves = createAsyncThunk(
  'adminLeave/fetchPending',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/leave/pending');
      return data as LeaveRequest[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending leaves');
    }
  }
);

export const updateLeaveStatus = createAsyncThunk(
  'adminLeave/updateStatus',
  async ({ requestId, status, adminRemarks }: { requestId: string; status: 'Approved' | 'Rejected'; adminRemarks?: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/leave/requests/${requestId}`, { status, adminRemarks });
      return { requestId, updatedRequest: data.request as LeaveRequest }; // Return ID and updated request
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || `Failed to ${status.toLowerCase()} request`);
    }
  }
);

export const fetchAllBalances = createAsyncThunk(
  'adminLeave/fetchAllBalances',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/leave/balances');
      return data as EmployeeLeaveBalanceAdmin[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch balances');
    }
  }
);

export const updateEmployeeBalance = createAsyncThunk(
  'adminLeave/updateBalance',
  async ({ employeeId, balances }: { employeeId: string; balances: { earned?: number; sick?: number; casual?: number } }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/leave/balances/${employeeId}`, balances);
      return data.employee as EmployeeLeaveBalanceAdmin; // Return updated employee balance info
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update balance');
    }
  }
);

// --- Slice ---
const adminLeaveSlice = createSlice({
  name: 'adminLeave',
  initialState,
  reducers: {
      clearAdminLeaveError: (state) => { state.error = null; },
      selectEmployeeForBalanceUpdate: (state, action: PayloadAction<EmployeeLeaveBalanceAdmin | null>) => {
          state.selectedEmployeeBalance = action.payload;
      }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Pending
      .addCase(fetchPendingLeaves.pending, (state) => { state.loadingPending = true; state.error = null; })
      .addCase(fetchPendingLeaves.fulfilled, (state, action: PayloadAction<LeaveRequest[]>) => {
        state.loadingPending = false;
        state.pendingRequests = action.payload;
      })
      .addCase(fetchPendingLeaves.rejected, (state, action) => { state.loadingPending = false; state.error = action.payload as string; })

      // Update Status
      .addCase(updateLeaveStatus.pending, (state) => { state.loadingAction = true; state.error = null; })
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        state.loadingAction = false;
        // Remove the processed request from the pending list
        state.pendingRequests = state.pendingRequests.filter(req => req._id !== action.payload.requestId);
        // We might need to update the balance list if the action was 'Approved', trigger refetch?
      })
      .addCase(updateLeaveStatus.rejected, (state, action) => { state.loadingAction = false; state.error = action.payload as string; })

       // Fetch All Balances
      .addCase(fetchAllBalances.pending, (state) => { state.loadingBalances = true; state.error = null; })
      .addCase(fetchAllBalances.fulfilled, (state, action: PayloadAction<EmployeeLeaveBalanceAdmin[]>) => {
        state.loadingBalances = false;
        state.allBalances = action.payload;
      })
      .addCase(fetchAllBalances.rejected, (state, action) => { state.loadingBalances = false; state.error = action.payload as string; })

       // Update Employee Balance
      .addCase(updateEmployeeBalance.pending, (state) => { state.loadingAction = true; state.error = null; })
      .addCase(updateEmployeeBalance.fulfilled, (state, action: PayloadAction<EmployeeLeaveBalanceAdmin>) => {
        state.loadingAction = false;
        // Update the balance in the list
        const index = state.allBalances.findIndex(emp => emp._id === action.payload._id);
        if (index !== -1) {
          state.allBalances[index] = action.payload;
        }
        state.selectedEmployeeBalance = null; // Close modal implicitly
      })
      .addCase(updateEmployeeBalance.rejected, (state, action) => { state.loadingAction = false; state.error = action.payload as string; });
  },
});

export const { clearAdminLeaveError, selectEmployeeForBalanceUpdate } = adminLeaveSlice.actions;
export default adminLeaveSlice.reducer;