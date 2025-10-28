// src/lib/redux/slices/employeePayslipSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';
import { Payslip, PayslipListResponse } from '../../../types';

interface EmployeePayslipState {
  payslips: Payslip[];
  selectedPayslip: Payslip | null; // For viewing details
  pagination: { currentPage: number, totalPages: number };
  loadingList: boolean;
  loadingDetail: boolean;
  error: string | null;
}

const initialState: EmployeePayslipState = {
  payslips: [],
  selectedPayslip: null,
  pagination: { currentPage: 1, totalPages: 1 },
  loadingList: false,
  loadingDetail: false,
  error: null,
};

// --- Thunks ---
export const fetchMyPayslips = createAsyncThunk(
  'employeePayslips/fetchMy',
  async (page: number = 1, { rejectWithValue, getState }) => {
    try {
      const { data } = await api.get(`/employee/payslips?page=${page}&limit=10`);
      const currentState = (getState() as RootState).employeePayslips;

      // Append or replace based on page number
       if (page > 1) {
          return {
              ...data,
              // Prepend new results to existing list (if backend sorts newest first)
              payslips: [...currentState.payslips, ...data.payslips]
          } as PayslipListResponse;
      } else {
          return data as PayslipListResponse; // Replace for page 1
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payslips');
    }
  }
);

export const fetchMyPayslipById = createAsyncThunk(
  'employeePayslips/fetchById',
  async (payslipId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/employee/payslips/${payslipId}`);
      return data as Payslip;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payslip details');
    }
  }
);

// --- Slice ---
const employeePayslipSlice = createSlice({
  name: 'employeePayslips',
  initialState,
  reducers: {
    clearEmployeePayslipError: (state) => { state.error = null; },
    clearSelectedPayslip: (state) => { state.selectedPayslip = null; state.loadingDetail = false; }
  },
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(fetchMyPayslips.pending, (state) => { state.loadingList = true; state.error = null; })
      .addCase(fetchMyPayslips.fulfilled, (state, action: PayloadAction<PayslipListResponse>) => {
        state.loadingList = false;
        state.payslips = action.payload.payslips; // Assumes backend returns combined list correctly if appending
        state.pagination = { currentPage: action.payload.currentPage, totalPages: action.payload.totalPages };
      })
      .addCase(fetchMyPayslips.rejected, (state, action) => { state.loadingList = false; state.error = action.payload as string; })

      // Fetch Detail
      .addCase(fetchMyPayslipById.pending, (state) => { state.loadingDetail = true; state.selectedPayslip = null; state.error = null; })
      .addCase(fetchMyPayslipById.fulfilled, (state, action: PayloadAction<Payslip>) => {
        state.loadingDetail = false;
        state.selectedPayslip = action.payload;
      })
      .addCase(fetchMyPayslipById.rejected, (state, action) => { state.loadingDetail = false; state.error = action.payload as string; });
  },
});

// Need RootState for getState in thunk
import { RootState } from '../store';

export const { clearEmployeePayslipError, clearSelectedPayslip } = employeePayslipSlice.actions;
export default employeePayslipSlice.reducer;