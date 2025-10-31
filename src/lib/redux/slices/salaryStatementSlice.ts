// src/lib/redux/slices/salaryStatementSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';

export interface SalaryStatementRow {
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  month: number;
  year: number;
  totalEarnings: number;
  totalDeductions: number;
  netPay: number;
  released: boolean;
  generatedAt: string;
  releasedAt: string;
  payslipId: string;
}

interface SalaryStatementState {
  rows: SalaryStatementRow[];
  loading: boolean;
  error: string | null;
  exporting: boolean;
  exportError: string | null;
  year: number;
  month: number;
}

const now = new Date();
const initialState: SalaryStatementState = {
  rows: [],
  loading: false,
  error: null,
  exporting: false,
  exportError: null,
  year: now.getFullYear(),
  month: now.getMonth() + 1,
};

export const fetchSalaryStatement = createAsyncThunk<
  { rows: SalaryStatementRow[]; year: number; month: number },
  { year: number; month: number },
  { rejectValue: string }
>('salaryStatement/fetch', async ({ year, month }, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/admin/payslips/statement/data?year=${year}&month=${month}`);
    return { rows: data?.payslips ?? [], year, month };
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || 'Failed to fetch salary statement');
  }
});

export const exportSalaryStatement = createAsyncThunk<
  void,
  { year: number; month: number },
  { rejectValue: string }
>('salaryStatement/export', async ({ year, month }, { rejectWithValue }) => {
  try {
    const res = await api.get(`/admin/payslips/statement/export?year=${year}&month=${month}`, {
      responseType: 'blob',
    });
    const filename = `Payslips_${year}-${String(month).padStart(2, '0')}.xlsx`;
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || 'Failed to export salary statement');
  }
});

const salaryStatementSlice = createSlice({
  name: 'salaryStatement',
  initialState,
  reducers: {
    setStatementMonth(state, action: PayloadAction<{ year: number; month: number }>) {
      state.year = action.payload.year;
      state.month = action.payload.month;
    },
    clearStatementError(state) {
      state.error = null;
      state.exportError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalaryStatement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalaryStatement.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload.rows;
        state.year = action.payload.year;
        state.month = action.payload.month;
      })
      .addCase(fetchSalaryStatement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch salary statement';
      })
      .addCase(exportSalaryStatement.pending, (state) => {
        state.exporting = true;
        state.exportError = null;
      })
      .addCase(exportSalaryStatement.fulfilled, (state) => {
        state.exporting = false;
      })
      .addCase(exportSalaryStatement.rejected, (state, action) => {
        state.exporting = false;
        state.exportError = action.payload || 'Failed to export salary statement';
      });
  },
});

export const { setStatementMonth, clearStatementError } = salaryStatementSlice.actions;
export default salaryStatementSlice.reducer;
