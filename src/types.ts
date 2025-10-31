// src/types.ts

// ====== AUTH ====== //
export interface Admin {
  _id: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}


// ====== EMPLOYEE ====== //

// Define sub-document types first for clarity
export interface Education {
  instituteName?: string;
  qualification?: string;
  grade?: string;
  area?: string;
  from?: string; // Storing dates as strings for form simplicity
  to?: string;
}

export interface Address {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  phoneNumber1?: string;
  phoneNumber2?: string;
  mobileNumber?: string;
  email?: string;
  otherContact?: string;
}

// The main Employee type for data received from API
export interface Employee {
  _id: string;
  employeeInfo: {
    name: string;
    email: string;
    number?: string;
    employeeId: string;
    password?: string; // Password won't be sent from API, but useful for creation form
    gender?: 'Male' | 'Female' | 'Other';
    title?: 'Mr.' | 'Ms.' | 'Mrs.';
    profilePicture?: string;
  };
  personalInfo?: {
    dob?: string;
    fathersName?: string;
    maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed';
    marriageDate?: string;
    spouseName?: string;
    nationality?: string;
    placeOfBirth?: string;
    countryOfOrigin?: string;
    religion?: string;
    isInternationalEmployee?: boolean;
    isPhysicallyChallenged?: boolean;
    personalEmail?: string;
    height?: string;
    weight?: string;
    identificationMark?: string;
    caste?: string;
    hobby?: string;
    isDirector?: boolean;
  };
  joiningDetails?: {
    joiningDate?: string;
    confirmationDate?: string;
    status?: 'Confirmed' | 'Pending' | 'Probation';
    probationPeriod?: string;
    noticePeriod?: string;
    currentCompanyExperience?: string;
    previousExperience?: string;
    totalExperience?: string;
    referredBy?: string;
  };
  jobDetails?: {
    currentPosition?: string;
    department?: string;
    reportsTo?: string; // Employee ID
  };
  identificationDetails?: {
    aadharCardNo?: string;
    panCardNo?: string;
  };
  educationDetails?: Education[];
  addresses?: {
    present?: Address;
    permanent?: Address;
  };
  backgroundCheck?: {
    verificationStatus?: 'Pending' | 'Completed' | 'Failed';
    verificationCompletedOn?: string;
    agencyName?: string;
    remarks?: string;
  };
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Type for the employee creation/update form data
export type EmployeeFormData = Omit<Employee, '_id' | 'createdAt' | 'updatedAt' | 'isActive'> & {
  profilePictureFile?: FileList;
};




export interface EmployeeLoginCredentials {
  employeeId: string;
  password: string;
}

// Basic employee info returned after login/profile check
export interface EmployeeInfo {
  _id: string;
  name: string;
  email: string;
  employeeId: string;
  profilePicture?: string;
}

// ====== EMPLOYEE ATTENDANCE ====== //
export interface TodaysAttendance {
    checkInTime: string | null; // ISO Date string or null
    checkOutTime: string | null; // ISO Date string or null
    isLate?: boolean;
    date?: string; // Date for which this record applies
}




export interface CheckedInEmployeeInfo {
  _id: string;
  name: string;
  employeeId: string;
  checkInTime: string; // ISO Date string
  isLate: boolean;
}

export interface TodayOverviewData {
  totalActiveEmployees: number;
  checkedInCount: number;
  notCheckedInCount: number;
  lateCheckInCount: number;
  checkedInList: CheckedInEmployeeInfo[];
}

// For Attendance History API Response
export interface EmployeeAttendanceHistory {
    _id: string;
    name: string;
    employeeId: string;
    // Attendance object where keys are 'YYYY-MM-DD' and values are 'P' or 'A'
    attendance: { [date: string]: 'P' | 'A' };
}

export interface AttendanceHistoryData {
    employeesAttendance: EmployeeAttendanceHistory[];
    dates: string[]; // Array of 'YYYY-MM-DD' strings for the columns
    currentPage: number;
    hasMore: boolean;
    // totalPages?: number; // Add if backend provides it
}



export type LeaveType = 'earned' | 'sick' | 'casual';
export type LeaveSession = 'Session 1' | 'Session 2';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

// For Employee Leave Balance API Response
export interface LeaveBalance {
    earned: number;
    sick: number;
    casual: number;
}

// For Leave Application Form Data
export interface LeaveApplyFormData {
    leaveType: LeaveType | '';
    fromDate: string; // YYYY-MM-DD
    toDate: string;   // YYYY-MM-DD
    fromSession: LeaveSession | '';
    toSession: LeaveSession | '';
    reason: string;
    applyingTo?: string;
}

// For Leave Request Data from API
export interface LeaveRequest {
    _id: string;
    employee: string | { // Could be populated
        _id: string;
        employeeInfo: { name: string; employeeId: string };
    };
    leaveType: LeaveType;
    fromDate: string; // ISO Date String
    toDate: string;   // ISO Date String
    fromSession: LeaveSession;
    toSession: LeaveSession;
    reason: string;
    applyingTo?: string;
    status: LeaveStatus;
    numberOfDays: number;
    createdAt: string; // ISO Date String
    actionTakenBy?: string; // Admin ID
    actionTakenAt?: string; // ISO Date String
    adminRemarks?: string;
}

// For API response when fetching leave requests (includes pagination)
export interface LeaveRequestListResponse {
    requests: LeaveRequest[];
    currentPage: number;
    totalPages: number;
    totalRequests: number;
}

// For Admin view of all employee balances
export interface EmployeeLeaveBalanceAdmin {
    _id: string; // Employee ObjectId
    employeeInfo: {
        name: string;
        employeeId: string;
    };
    leaveBalances: LeaveBalance;
}



export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Open' | 'Completed';

// For Task Form Data (Employee and Admin use slightly different versions)
export interface TaskFormData {
    taskName: string;
    description?: string;
    priority?: TaskPriority;
    dueDate?: string; // YYYY-MM-DD
    tags?: string; // Comma-separated string for input, backend expects array
}
export interface AdminTaskFormData extends TaskFormData {
    assigneeEmployeeId: string; // Required for Admin creation
}

// For Task Data received from API
export interface Task {
    _id: string;
    taskName: string;
    description?: string;
    assigneeObjectId: string; // Employee ObjectId
    assigneeEmployeeId: string; // Employee String ID
    assigneeName: string;
    priority: TaskPriority;
    dueDate?: string; // ISO Date String
    tags: string[];
    status: TaskStatus;
    completedAt?: string; // ISO Date String
    createdByObjectId: string; // Admin or Employee ObjectId
    createdByModel: 'Admin' | 'Employee';
    createdAt: string; // ISO Date String
    updatedAt: string; // ISO Date String
}

// For API response when fetching tasks (includes pagination)
export interface TaskListResponse {
    tasks: Task[];
    currentPage: number;
    totalPages: number;
    totalTasks: number;
}




export interface SalaryFormData {
    employeeId: string; // Employee ObjectId
    monthlySalary: number | string; // Allow string for input, convert later
    professionalTax: number | string; // Allow string for input, convert later
}


export interface BankDetails {
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    branchName?: string;
    accountType?: '' | 'Savings' | 'Current' | 'Other';
    paymentType?: '' | 'Account Transfer' | 'Cheque' | 'Cash' | 'Other';
    nameAsPerBank?: string;
}



// For Salary Data from API (Admin List View)
export interface SalaryAdminInfo {
    _id: string; // Salary ObjectId
    employee: { // Populated employee info
        _id: string; // Employee ObjectId
        employeeInfo: { name: string; employeeId: string };
        isActive: boolean;
    };
    monthlySalary: number;
    professionalTax: number;
    bankDetails?: BankDetails;
    updatedAt: string; 


}

// For Payslip Generation Form Data (Admin)
export interface PayslipGenerateFormData {
    employeeId: string; // Employee ObjectId
    month: number | string; // Allow string for input
    year: number | string; // Allow string for input
}

// For Payslip Data from API (Includes calculated fields)
export interface Payslip {
    _id: string; // Payslip ObjectId
    employee: string | { // Could be populated ObjectId or full object
        _id: string;
        employeeInfo: { name: string; employeeId: string };
    };
    salaryDetails: string; // Salary ObjectId
    month: number;
    year: number;
    earnings: {
        basic: number;
        hra: number;
        medicalAllowance: number;
        specialAllowance: number;
        total: number;
    };
    deductions: {
        professionalTax: number;
        total: number;
    };
    netPay: number;
    isReleased: boolean;
    generatedAt: string; // ISO Date String
    releasedAt?: string | null; // ISO Date String or null
    employeeSnapshot: { // Data frozen at time of generation
        name: string;
        employeeId: string;
        designation?: string;
        department?: string;
        panNumber?: string;
        bankDetails?: {
            bankName?: string;
            accountNumber?: string; // Consider if this should be stored/displayed fully
            ifscCode?: string;
        }
    };
    createdAt: string; // ISO Date String
    updatedAt: string; // ISO Date String
}

// For API response when fetching payslips (includes pagination)
export interface PayslipListResponse {
    payslips: Payslip[];
    currentPage: number;
    totalPages: number;
    totalPayslips: number;
}