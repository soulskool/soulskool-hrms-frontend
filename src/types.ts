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