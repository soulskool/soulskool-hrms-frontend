// src/lib/validation/employeeSchema.ts

import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const addressSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
  phoneNumber1: z.string().optional(),
  phoneNumber2: z.string().optional(),
  mobileNumber: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  otherContact: z.string().optional(),
}).optional();

const educationSchema = z.object({
    instituteName: z.string().optional(),
    qualification: z.string().optional(),
    grade: z.string().optional(),
    area: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
});


export const employeeFormSchema = z.object({
  // Step 1: Employee Information
  employeeInfo: z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Invalid primary email address.' }),
    employeeId: z.string().min(1, { message: 'Employee ID is required.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }).optional().or(z.literal('')),
    number: z.string().optional(),
    gender: z.enum(['', 'Male', 'Female', 'Other']).optional(),
    title: z.enum(['', 'Mr.', 'Ms.', 'Mrs.']).optional(),
  }),

  profilePictureFile: z.any().optional(),

  // Step 2: Personal Information
  personalInfo: z.object({
      dob: z.string().optional(),
      fathersName: z.string().optional(),
      maritalStatus: z.enum(['', 'Single', 'Married', 'Divorced', 'Widowed']).optional(),
      marriageDate: z.string().optional(),
      spouseName: z.string().optional(),
      nationality: z.string().optional(),
      placeOfBirth: z.string().optional(),
      countryOfOrigin: z.string().optional(),
      religion: z.string().optional(),
      isInternationalEmployee: z.boolean().optional(),
      isPhysicallyChallenged: z.boolean().optional(),
      personalEmail: z.string().email({ message: 'Invalid personal email address.' }).optional().or(z.literal('')),
      height: z.string().optional(),
      weight: z.string().optional(),
      identificationMark: z.string().optional(),
      caste: z.string().optional(),
      hobby: z.string().optional(),
      isDirector: z.boolean().optional(),
  }).optional(),

  // Step 3: Joining & Job Details
  joiningDetails: z.object({
      joiningDate: z.string().optional(),
      confirmationDate: z.string().optional(),
      status: z.enum(['', 'Confirmed', 'Pending', 'Probation']).optional(),
      probationPeriod: z.string().optional(),
      noticePeriod: z.string().optional(),
      currentCompanyExperience: z.string().optional(),
      previousExperience: z.string().optional(),
      totalExperience: z.string().optional(),
      referredBy: z.string().optional(),
  }).optional(),
  
  jobDetails: z.object({
    currentPosition: z.string().optional(),
    department: z.string().optional(),
    reportsTo: z.string().optional(),
  }).optional(),

  // Step 4: Identification & Address
  identificationDetails: z.object({
    aadharCardNo: z.string().optional(),
    panCardNo: z.string().optional(),
  }).optional(),
  
  addresses: z.object({
    present: addressSchema,
    permanent: addressSchema,
  }).optional(),

  // Step 5: Education & Background
  educationDetails: z.array(educationSchema),
  
  backgroundCheck: z.object({
      verificationStatus: z.enum(['', 'Pending', 'Completed', 'Failed']).optional(),
      verificationCompletedOn: z.string().optional(),
      agencyName: z.string().optional(),
      remarks: z.string().optional(),
  }).optional(),

}).passthrough();

export type EmployeeFormSchema = z.infer<typeof employeeFormSchema>;