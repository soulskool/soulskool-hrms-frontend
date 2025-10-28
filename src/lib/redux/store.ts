import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import employeeReducer from './slices/employeeSlice';
import employeeAuthReducer from './slices/employeeAuthSlice'; 
import attendanceReducer from './slices/attendanceSlice';
import adminAttendanceReducer from './slices/adminAttendanceSlice';
import leaveReducer from './slices/leaveSlice'; 
import adminLeaveReducer from './slices/adminLeaveSlice';
import employeeTaskReducer from './slices/employeeTaskSlice'; // Import employee task slice
import adminTaskReducer from './slices/adminTaskSlice';
import employeePayslipReducer from './slices/employeePayslipSlice'; // Import employee payslip slice
import adminPayrollReducer from './slices/adminPayrollSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    employeeAuth: employeeAuthReducer, 
    attendance: attendanceReducer,
    adminAttendance: adminAttendanceReducer,
    leave: leaveReducer, 
    adminLeave: adminLeaveReducer,
    employeeTasks: employeeTaskReducer, // Add employee task reducer
    adminTasks: adminTaskReducer,
    employeePayslips: employeePayslipReducer, // Add employee payslip reducer
    adminPayroll: adminPayrollReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
