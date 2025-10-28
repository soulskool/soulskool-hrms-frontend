// src/lib/redux/slices/attendanceSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';
import { TodaysAttendance } from '../../../types';

interface AttendanceState {
  today: TodaysAttendance;
  loading: boolean;
  error: string | null;
}

// Helper to get today's date string in YYYY-MM-DD format (local time)
const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const initialState: AttendanceState = {
  // Initialize based on current date to avoid mismatches if app is open overnight
  today: { checkInTime: null, checkOutTime: null, date: getTodayDateString() },
  loading: false,
  error: null,
};

// --- Async Thunks ---

// Mark Check-In
export const markCheckIn = createAsyncThunk(
  'attendance/checkIn',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/employee/attendance/checkin');
      // Return relevant data from response
      return { checkInTime: data.checkInTime, isLate: data.isLate } as Partial<TodaysAttendance>;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Check-in failed');
    }
  }
);

// Mark Check-Out
export const markCheckOut = createAsyncThunk(
  'attendance/checkOut',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/employee/attendance/checkout');
      return { checkOutTime: data.checkOutTime } as Partial<TodaysAttendance>;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Check-out failed');
    }
  }
);

// TODO: Potentially add a thunk 'fetchTodaysAttendance' to call on dashboard load
// if the profile check doesn't return attendance status.


// --- Slice Definition ---

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    // Action to manually set today's attendance if fetched separately
    setTodaysAttendance: (state, action: PayloadAction<TodaysAttendance>) => {
        // Only update if the date matches today to prevent stale data
        if(action.payload.date === getTodayDateString()){
            state.today = action.payload;
        } else {
             // If date doesn't match, reset to initial state for today
             state.today = { checkInTime: null, checkOutTime: null, date: getTodayDateString() };
        }
    },
     // Reset attendance state, e.g. on logout or new day
    resetAttendance: (state) => {
        state.today = { checkInTime: null, checkOutTime: null, date: getTodayDateString() };
        state.error = null;
        state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Check-In Cases
      .addCase(markCheckIn.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(markCheckIn.fulfilled, (state, action: PayloadAction<Partial<TodaysAttendance>>) => {
        state.loading = false;
        // Ensure we're updating for the correct date
        const todayStr = getTodayDateString();
        if(state.today.date !== todayStr){
            state.today = { checkInTime: null, checkOutTime: null, date: todayStr }; // Reset if date changed
        }
        state.today.checkInTime = action.payload.checkInTime || state.today.checkInTime;
        state.today.isLate = action.payload.isLate ?? state.today.isLate;
      })
      .addCase(markCheckIn.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      // Check-Out Cases
      .addCase(markCheckOut.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(markCheckOut.fulfilled, (state, action: PayloadAction<Partial<TodaysAttendance>>) => {
        state.loading = false;
        const todayStr = getTodayDateString();
         if(state.today.date !== todayStr){
             state.today = { checkInTime: null, checkOutTime: null, date: todayStr };
         }
        state.today.checkOutTime = action.payload.checkOutTime || state.today.checkOutTime;
      })
      .addCase(markCheckOut.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export const { setTodaysAttendance, resetAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;