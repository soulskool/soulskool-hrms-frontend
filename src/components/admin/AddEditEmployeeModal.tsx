// "use client";

// import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { employeeFormSchema, EmployeeFormSchema } from "../../lib/validation/employeeSchema";
// import { Employee } from "../../types";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '../../lib/redux/store';
// import { createEmployee, updateEmployee } from '../../lib/redux/slices/employeeSlice';
// import toast from 'react-hot-toast';
// import { X, Plus, Trash } from "lucide-react";

// // Props definition
// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   employee?: Employee | null;
// }

// const formSteps = [
//   { id: 1, title: 'Core Information' },
//   { id: 2, title: 'Personal Details' },
//   { id: 3, title: 'Joining & Job Details' },
//   { id: 4, title: 'Identification & Address' },
//   { id: 5, title: 'Education & Background' },
// ];

// export default function AddEditEmployeeModal({ isOpen, onClose, employee }: Props) {
//   const dispatch = useDispatch<AppDispatch>();
//   const { loading } = useSelector((state: RootState) => state.employees);
//   const [currentStep, setCurrentStep] = useState(1);
//   const isEditMode = Boolean(employee);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     trigger,
//     control,
//     formState: { errors },
//   } = useForm<EmployeeFormSchema>({
//     resolver: zodResolver(employeeFormSchema),
//     mode: 'onTouched',
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "educationDetails",
//   });

//   useEffect(() => {
//     if (isOpen) {
//       if (employee) {
//         // Fix for TypeScript error by casting the type
//         reset(employee as unknown as EmployeeFormSchema);
//       } else {
//         reset({
//           employeeInfo: { name: '', email: '', employeeId: '', password: '' },
//           educationDetails: [],
//         });
//       }
//       setCurrentStep(1);
//     }
//   }, [employee, isOpen, reset]);

//   const handleNext = async () => {
//     let isValid = false;
//     if (currentStep === 1) {
//       isValid = await trigger(['employeeInfo.name', 'employeeInfo.email', 'employeeInfo.employeeId']);
//       if (!isEditMode) isValid = await trigger('employeeInfo.password') && isValid;
//     } else {
//       isValid = true;
//     }
    
//     if (isValid && currentStep < formSteps.length) {
//       setCurrentStep(s => s + 1);
//     }
//   };
  
//   const onSubmit: SubmitHandler<EmployeeFormSchema> = async (data) => {
//     const formData = new FormData();
//     const jsonData = JSON.stringify(data);
//     formData.append('jsonData', jsonData);

//     if (data.profilePictureFile && data.profilePictureFile.length > 0) {
//       formData.append('profilePicture', data.profilePictureFile[0]);
//     }

//     let result;
//     if (isEditMode && employee) {
//       result = await dispatch(updateEmployee({ id: employee._id, employeeData: formData }));
//       if (updateEmployee.fulfilled.match(result)) toast.success('Employee updated successfully');
//     } else {
//       result = await dispatch(createEmployee(formData));
//       if (createEmployee.fulfilled.match(result)) toast.success('Employee created successfully');
//     }
    
//     if (result.meta.requestStatus === 'rejected') {
//       toast.error(result.payload as string || 'An unknown error occurred');
//     } else {
//       onClose();
//     }
//   };

//   if (!isOpen) return null;
  
//   const renderSectionTitle = (title: string) => <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 col-span-full">{title}</h3>;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col">
//         {/* Header */}
//         <div className="p-5 border-b flex justify-between items-center">
//             <div>
//               <h2 className="text-xl font-bold text-gray-800">{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h2>
//               <p className="text-sm text-gray-500">{formSteps.find(s => s.id === currentStep)?.title}</p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 {formSteps.map(step => (
//                   <div key={step.id} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
//                     {step.id}
//                   </div>
//                 ))}
//               </div>
//               <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
//             </div>
//         </div>

//         {/* Form Body */}
//         <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">
//           {currentStep === 1 && (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
//               {renderSectionTitle('Employee Details')}
//               <div>
//                 <label className="form-label">Full Name*</label>
//                 <input {...register("employeeInfo.name")} className="input" />
//                 {errors.employeeInfo?.name && <p className="error-text">{errors.employeeInfo.name.message}</p>}
//               </div>
//               <div>
//                 <label className="form-label">Employee ID*</label>
//                 <input {...register("employeeInfo.employeeId")} className="input" disabled={isEditMode} />
//                 {errors.employeeInfo?.employeeId && <p className="error-text">{errors.employeeInfo.employeeId.message}</p>}
//               </div>
//               <div>
//                 <label className="form-label">Primary Email*</label>
//                 <input type="email" {...register("employeeInfo.email")} className="input" />
//                 {errors.employeeInfo?.email && <p className="error-text">{errors.employeeInfo.email.message}</p>}
//               </div>
//               {!isEditMode && <div>
//                 <label className="form-label">Password*</label>
//                 <input type="password" {...register("employeeInfo.password")} className="input" />
//                 {errors.employeeInfo?.password && <p className="error-text">{errors.employeeInfo.password.message}</p>}
//               </div>}
//                <div>
//                  <label className="form-label">Title</label>
//                  <select {...register("employeeInfo.title")} className="input">
//                     <option value="">Select Title</option>
//                     <option value="Mr.">Mr.</option>
//                     <option value="Ms.">Ms.</option>
//                     <option value="Mrs.">Mrs.</option>
//                  </select>
//               </div>
//                <div>
//                  <label className="form-label">Gender</label>
//                  <select {...register("employeeInfo.gender")} className="input">
//                     <option value="">Select Gender</option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                  </select>
//               </div>
//                <div>
//                 <label className="form-label">Phone Number</label>
//                 <input {...register("employeeInfo.number")} className="input" />
//               </div>
//               <div className="md:col-span-3">
//                 <label className="form-label">Profile Picture</label>
//                 <input type="file" accept="image/*" {...register("profilePictureFile")} className="input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
//                 {errors.profilePictureFile && <p className="error-text">{errors.profilePictureFile.message as string}</p>}
//               </div>
//             </div>
//           )}

//           {currentStep === 2 && (
//              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
//                 {renderSectionTitle('Personal Information')}
//                 <div>
//                     <label className="form-label">Date of Birth</label>
//                     <input type="date" {...register("personalInfo.dob")} className="input" />
//                 </div>
//                 <div>
//                     <label className="form-label">Father's Name</label>
//                     <input {...register("personalInfo.fathersName")} className="input" />
//                 </div>
//                 <div>
//                     <label className="form-label">Marital Status</label>
//                     <select {...register("personalInfo.maritalStatus")} className="input">
//                         <option value="">Select Status</option>
//                         <option value="Single">Single</option>
//                         <option value="Married">Married</option>
//                         <option value="Divorced">Divorced</option>
//                         <option value="Widowed">Widowed</option>
//                     </select>
//                 </div>
//                 <div>
//                     <label className="form-label">Date of Marriage</label>
//                     <input type="date" {...register("personalInfo.marriageDate")} className="input" />
//                 </div>
//                 <div>
//                     <label className="form-label">Spouse Name</label>
//                     <input {...register("personalInfo.spouseName")} className="input" />
//                 </div>
//                 <div>
//                     <label className="form-label">Nationality</label>
//                     <input {...register("personalInfo.nationality")} className="input" />
//                 </div>
//                 <div>
//                     <label className="form-label">Place of Birth</label>
//                     <input {...register("personalInfo.placeOfBirth")} className="input" />
//                 </div>
//                 <div>
//                     <label className="form-label">Country of Origin</label>
//                     <input {...register("personalInfo.countryOfOrigin")} className="input" />
//                 </div>
//                  <div>
//                     <label className="form-label">Religion</label>
//                     <input {...register("personalInfo.religion")} className="input" />
//                 </div>
//                 <div>
//                     <label className="form-label">Personal Email</label>
//                     <input type="email" {...register("personalInfo.personalEmail")} className="input" />
//                      {errors.personalInfo?.personalEmail && <p className="error-text">{errors.personalInfo.personalEmail.message}</p>}
//                 </div>
//                  <div>
//                     <label className="form-label">Height (e.g., 5'10")</label>
//                     <input {...register("personalInfo.height")} className="input" />
//                 </div>
//                  <div>
//                     <label className="form-label">Weight (e.g., 70kg)</label>
//                     <input {...register("personalInfo.weight")} className="input" />
//                 </div>
//                 <div className="md:col-span-3">
//                     <label className="form-label">Identification Mark</label>
//                     <input {...register("personalInfo.identificationMark")} className="input" />
//                 </div>
//                 <div>
//                     <label className="form-label">Caste</label>
//                     <input {...register("personalInfo.caste")} className="input" />
//                 </div>
//                 <div className="md:col-span-2">
//                     <label className="form-label">Hobbies</label>
//                     <input {...register("personalInfo.hobby")} className="input" />
//                 </div>
//                 <div className="flex items-center space-x-2 pt-4">
//                     <input type="checkbox" {...register("personalInfo.isInternationalEmployee")} className="h-4 w-4 rounded" />
//                     <label className="form-label m-0">International Employee?</label>
//                 </div>
//                 <div className="flex items-center space-x-2 pt-4">
//                     <input type="checkbox" {...register("personalInfo.isPhysicallyChallenged")} className="h-4 w-4 rounded" />
//                     <label className="form-label m-0">Physically Challenged?</label>
//                 </div>
//                  <div className="flex items-center space-x-2 pt-4">
//                     <input type="checkbox" {...register("personalInfo.isDirector")} className="h-4 w-4 rounded" />
//                     <label className="form-label m-0">Is a Director?</label>
//                 </div>
//              </div>
//           )}

//           {currentStep === 3 && (
//              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
//                 {renderSectionTitle('Employment Details')}
//                 <div>
//                     <label className="form-label">Joining Date</label>
//                     <input type="date" {...register("joiningDetails.joiningDate")} className="input" />
//                 </div>
//                 <div>
//                     <label className="form-label">Confirmation Date</label>
//                     <input type="date" {...register("joiningDetails.confirmationDate")} className="input" />
//                 </div>
//                 <div>
//                     <label className="form-label">Employment Status</label>
//                      <select {...register("joiningDetails.status")} className="input">
//                         <option value="">Select Status</option>
//                         <option value="Probation">Probation</option>
//                         <option value="Confirmed">Confirmed</option>
//                         <option value="Pending">Pending</option>
//                     </select>
//                 </div>
//                 <div>
//                     <label className="form-label">Probation Period</label>
//                     <input {...register("joiningDetails.probationPeriod")} className="input" placeholder="e.g., 6 Months"/>
//                 </div>
//                 <div>
//                     <label className="form-label">Notice Period</label>
//                     <input {...register("joiningDetails.noticePeriod")} className="input" placeholder="e.g., 3 Months"/>
//                 </div>
//                 <div>
//                     <label className="form-label">Referred By</label>
//                     <input {...register("joiningDetails.referredBy")} className="input" />
//                 </div>
//                 <div className="md:col-span-3 h-px bg-gray-200 my-4"></div>
//                 <div>
//                     <label className="form-label">Current Co. Experience</label>
//                     <input {...register("joiningDetails.currentCompanyExperience")} className="input" />
//                 </div>
//                 <div>
//                     <label className="form-label">Previous Experience</label>
//                     <input {...register("joiningDetails.previousExperience")} className="input" />
//                 </div>
//                 <div>
//                     <label className="form-label">Total Experience</label>
//                     <input {...register("joiningDetails.totalExperience")} className="input" />
//                 </div>
//                  <div className="md:col-span-3 h-px bg-gray-200 my-4"></div>
//                 <div>
//                     <label className="form-label">Current Position</label>
//                     <input {...register("jobDetails.currentPosition")} className="input" />
//                 </div>
//                 <div>
//                     <label className="form-label">Department</label>
//                     <input {...register("jobDetails.department")} className="input" />
//                 </div>
//                 <div>
//                     <label className="form-label">Reports To (Employee ID)</label>
//                     <input {...register("jobDetails.reportsTo")} className="input" />
//                 </div>
//              </div>
//           )}
          
//           {currentStep === 4 && (
//              <div className="space-y-6">
//                 {renderSectionTitle("Identification")}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
//                    <div>
//                         <label className="form-label">Aadhar Card Number</label>
//                         <input {...register("identificationDetails.aadharCardNo")} className="input" />
//                     </div>
//                     <div>
//                         <label className="form-label">PAN Card Number</label>
//                         <input {...register("identificationDetails.panCardNo")} className="input" />
//                     </div>
//                 </div>
//                 {renderSectionTitle("Present Address")}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
//                     <div className="md:col-span-3">
//                         <label className="form-label">Address</label>
//                         <textarea {...register("addresses.present.address")} className="input" rows={2}></textarea>
//                     </div>
//                     <div><label className="form-label">City</label><input {...register("addresses.present.city")} className="input" /></div>
//                     <div><label className="form-label">State</label><input {...register("addresses.present.state")} className="input" /></div>
//                     <div><label className="form-label">Pincode</label><input {...register("addresses.present.pincode")} className="input" /></div>
//                     <div><label className="form-label">Country</label><input {...register("addresses.present.country")} className="input" /></div>
//                     <div><label className="form-label">Mobile Number</label><input {...register("addresses.present.mobileNumber")} className="input" /></div>
//                 </div>
//                  {renderSectionTitle("Permanent Address")}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
//                     <div className="md:col-span-3">
//                         <label className="form-label">Address</label>
//                         <textarea {...register("addresses.permanent.address")} className="input" rows={2}></textarea>
//                     </div>
//                     <div><label className="form-label">City</label><input {...register("addresses.permanent.city")} className="input" /></div>
//                     <div><label className="form-label">State</label><input {...register("addresses.permanent.state")} className="input" /></div>
//                     <div><label className="form-label">Pincode</label><input {...register("addresses.permanent.pincode")} className="input" /></div>
//                 </div>
//               </div>
//           )}

//           {currentStep === 5 && (
//               <div className="space-y-6">
//                 <div className="flex justify-between items-center">
//                     {renderSectionTitle("Education Details")}
//                     <button type="button" onClick={() => append({})} className="btn-secondary text-xs flex items-center"><Plus size={14} className="mr-1"/> Add Education</button>
//                 </div>
//                 {fields.map((field, index) => (
//                     <div key={field.id} className="grid grid-cols-2 md:grid-cols-6 gap-4 items-end p-4 border rounded-lg relative bg-gray-50">
//                         <div className="col-span-2 md:col-span-6 text-sm font-semibold text-gray-600">Education #{index + 1}</div>
//                         <div className="col-span-2"><label className="form-label">Institute</label><input {...register(`educationDetails.${index}.instituteName`)} className="input" /></div>
//                         <div><label className="form-label">Qualification</label><input {...register(`educationDetails.${index}.qualification`)} className="input" /></div>
//                         <div><label className="form-label">Area/Field</label><input {...register(`educationDetails.${index}.area`)} className="input" /></div>
//                         <div><label className="form-label">Grade/Score</label><input {...register(`educationDetails.${index}.grade`)} className="input" /></div>
//                         <button type="button" onClick={() => remove(index)} className="absolute top-3 right-3 text-red-500 hover:text-red-700"><Trash size={16}/></button>
//                     </div>
//                 ))}
                
//                 {renderSectionTitle("Background Check")}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
//                     <div>
//                         <label className="form-label">Verification Status</label>
//                         <select {...register("backgroundCheck.verificationStatus")} className="input">
//                            <option value="">Select Status</option>
//                            <option value="Pending">Pending</option>
//                            <option value="Completed">Completed</option>
//                            <option value="Failed">Failed</option>
//                         </select>
//                     </div>
//                     <div>
//                         <label className="form-label">Completed On</label>
//                         <input type="date" {...register("backgroundCheck.verificationCompletedOn")} className="input" />
//                     </div>
//                      <div>
//                         <label className="form-label">Agency Name</label>
//                         <input {...register("backgroundCheck.agencyName")} className="input" />
//                     </div>
//                      <div className="md:col-span-3">
//                         <label className="form-label">Remarks</label>
//                         <textarea {...register("backgroundCheck.remarks")} className="input" rows={2}></textarea>
//                     </div>
//                 </div>
//               </div>
//             )}
//         </form>

//         {/* Footer */}
//         <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
//             <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
//             <div className="flex items-center space-x-2">
//               {currentStep > 1 && <button type="button" onClick={() => setCurrentStep(s => s - 1)} className="btn-secondary">Back</button>}
//               {currentStep < formSteps.length && <button type="button" onClick={handleNext} className="btn-primary">Next</button>}
//               {currentStep === formSteps.length && <button type="submit" onClick={handleSubmit(onSubmit)} disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Employee'}</button>}
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// }













// src/components/admin/AddEditEmployeeModal.tsx

"use client";

import { useForm, SubmitHandler, useFieldArray, Controller, FieldArrayPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeFormSchema, EmployeeFormSchema } from "../../lib/validation/employeeSchema";
import { Employee } from "../../types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/redux/store';
import { createEmployee, updateEmployee } from '../../lib/redux/slices/employeeSlice';
import toast from 'react-hot-toast';
import { X, Plus, Trash2, Loader2 } from "lucide-react";

// Props definition
interface Props {
  isOpen: boolean;
  onClose: () => void;
  employeeToEdit?: Employee | null; // Pass the full employee object
}

const formSteps = [
  { id: 1, title: 'Core Information' },
  { id: 2, title: 'Personal Details' },
  { id: 3, title: 'Joining & Job Details' },
  { id: 4, title: 'Identification & Address' },
  { id: 5, title: 'Education & Background' },
];

export default function AddEditEmployeeModal({ isOpen, onClose, employeeToEdit }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { loadingAction: isSubmitting, error: submissionError } = useSelector((state: RootState) => state.employees);
  const [currentStep, setCurrentStep] = useState(1);
  const isEditMode = Boolean(employeeToEdit);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    control,
    setValue, // Added setValue
    formState: { errors },
  } = useForm<EmployeeFormSchema>({
    resolver: zodResolver(employeeFormSchema),
    mode: 'onTouched',
    defaultValues: {
        educationDetails: [],
        isActive: true,
        personalInfo: { isInternationalEmployee: false, isPhysicallyChallenged: false, isDirector: false},
    }
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: "educationDetails" as FieldArrayPath<EmployeeFormSchema>,
  });

  // Effect to reset form when modal opens or employeeToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && employeeToEdit) {
         // Format date strings BEFORE resetting
         const formattedEmployee = {
              ...employeeToEdit,
              // Keep plain text password
              personalInfo: {
                  ...employeeToEdit.personalInfo,
                  dob: employeeToEdit.personalInfo?.dob?.split('T')[0] || undefined,
                  marriageDate: employeeToEdit.personalInfo?.marriageDate?.split('T')[0] || undefined,
              },
              joiningDetails: {
                  ...employeeToEdit.joiningDetails,
                  joiningDate: employeeToEdit.joiningDetails?.joiningDate?.split('T')[0] || undefined,
                  confirmationDate: employeeToEdit.joiningDetails?.confirmationDate?.split('T')[0] || undefined,
              },
              backgroundCheck: {
                  ...employeeToEdit.backgroundCheck,
                  verificationCompletedOn: employeeToEdit.backgroundCheck?.verificationCompletedOn?.split('T')[0] || undefined,
              }
          };
        reset(formattedEmployee as unknown as EmployeeFormSchema);
      } else {
        // Reset for creation mode
        reset({
          employeeInfo: { name: '', email: '', employeeId: '', password: '' },
          educationDetails: [],
          isActive: true,
          personalInfo: { isInternationalEmployee: false, isPhysicallyChallenged: false, isDirector: false},
        });
      }
      setCurrentStep(1); // Ensure starting at step 1
    } else {
        reset({}); // Clear form when closed
    }
  }, [employeeToEdit, isOpen, isEditMode, reset]);


  const handleNext = async () => {
    let fieldsToValidate: (keyof EmployeeFormSchema['employeeInfo'])[] = ['name', 'email', 'employeeId'];
    if (!isEditMode) {
      fieldsToValidate.push('password');
    }
    const fullFieldNames = fieldsToValidate.map(field => `employeeInfo.${field}`);

    const isValid = await trigger(fullFieldNames as any);

    if (isValid && currentStep < formSteps.length) {
      setCurrentStep(s => s + 1);
    } else if (!isValid && currentStep === 1) {
      toast.error("Please fill in all required fields marked with *");
    }
  };

  const onSubmit: SubmitHandler<EmployeeFormSchema> = async (data) => {
    const formData = new FormData();

    const processedData = {
        ...data,
        isActive: data.isActive ?? true, // Default to true if somehow undefined
        personalInfo: {
            ...data.personalInfo,
            isInternationalEmployee: data.personalInfo?.isInternationalEmployee ?? false,
            isPhysicallyChallenged: data.personalInfo?.isPhysicallyChallenged ?? false,
            isDirector: data.personalInfo?.isDirector ?? false,
        }
    };

    // Ensure password is not an empty string if it's optional during update
    if (isEditMode && processedData.employeeInfo && processedData.employeeInfo.password === '') {
        delete processedData.employeeInfo.password; // Remove empty password string before sending
    }

    const jsonData = JSON.stringify(processedData);
    formData.append('jsonData', jsonData);

    if (data.profilePictureFile && data.profilePictureFile.length > 0) {
      formData.append('profilePicture', data.profilePictureFile[0]);
    }

    let result;
    if (isEditMode && employeeToEdit) {
      result = await dispatch(updateEmployee({ id: employeeToEdit._id, employeeData: formData }));
      if (updateEmployee.fulfilled.match(result)) toast.success('Employee updated successfully');
    } else {
       // Re-check password presence for creation
       if (!processedData.employeeInfo.password) {
           toast.error('Password is required when creating a new employee.');
           // Focus password field if possible (might need ref)
           return;
       }
      result = await dispatch(createEmployee(formData));
      if (createEmployee.fulfilled.match(result)) toast.success('Employee created successfully');
    }

    if (result.meta.requestStatus === 'rejected') {
        toast.error(result.payload as string || 'An unknown error occurred');
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  const renderSectionTitle = (title: string) => <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 col-span-full">{title}</h3>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col my-auto">
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-xl z-10">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h2>
              <p className="text-sm text-gray-500">{formSteps.find(s => s.id === currentStep)?.title}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {formSteps.map(step => (
                  <div key={step.id} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {step.id}
                  </div>
                ))}
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
            </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6">
           {submissionError && (
              <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-md">
                  {submissionError}
              </div>
           )}
            <div className="space-y-6">

                {/* Step 1: Core Information */}
                {currentStep === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                       {renderSectionTitle('Employee Details')}
                       <div>
                         <label className="form-label">Full Name*</label>
                         <input {...register("employeeInfo.name")} className={`input ${errors.employeeInfo?.name ? 'border-red-500' : ''}`} />
                         {errors.employeeInfo?.name && <p className="error-text">{errors.employeeInfo.name.message}</p>}
                       </div>
                       <div>
                         <label className="form-label">Employee ID*</label>
                         <input {...register("employeeInfo.employeeId")} className={`input ${errors.employeeInfo?.employeeId ? 'border-red-500' : ''}`} disabled={isEditMode} />
                         {errors.employeeInfo?.employeeId && <p className="error-text">{errors.employeeInfo.employeeId.message}</p>}
                       </div>
                       <div>
                         <label className="form-label">Primary Email*</label>
                         <input type="email" {...register("employeeInfo.email")} className={`input ${errors.employeeInfo?.email ? 'border-red-500' : ''}`} />
                         {errors.employeeInfo?.email && <p className="error-text">{errors.employeeInfo.email.message}</p>}
                       </div>
                       <div>
                           <label className="form-label">{isEditMode ? 'Password (Leave blank to keep current)' : 'Password*'}</label>
                           <input
                               type="text" // Show plain text
                               {...register("employeeInfo.password")}
                               placeholder={isEditMode ? 'Enter new password to change' : ''}
                               className={`input ${errors.employeeInfo?.password ? 'border-red-500' : ''}`}
                           />
                           {/* Password validation is complex with optionality, Zod handles base length */}
                           {errors.employeeInfo?.password && <p className="error-text">{isEditMode ? 'Password must be at least 6 characters if changed.' : errors.employeeInfo.password.message}</p>}
                       </div>
                       <div>
                         <label className="form-label">Title</label>
                         <select {...register("employeeInfo.title")} className="input">
                            <option value="">Select Title</option>
                            <option value="Mr.">Mr.</option>
                            <option value="Ms.">Ms.</option>
                            <option value="Mrs.">Mrs.</option>
                         </select>
                      </div>
                       <div>
                         <label className="form-label">Gender</label>
                         <select {...register("employeeInfo.gender")} className="input">
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                         </select>
                      </div>
                       <div>
                        <label className="form-label">Contact Number</label>
                        <input {...register("employeeInfo.number")} className="input" />
                      </div>
                      {/* isActive Field */}
                      <div>
                          <label className="form-label">Account Status</label>
                          <Controller
                              name="isActive"
                              control={control}
                              defaultValue={true} // Default new users to Active
                              render={({ field }) => (
                                  <select
                                      value={String(field.value)} // Controlled component needs string value
                                      onChange={e => field.onChange(e.target.value === 'true')} // Convert back to boolean on change
                                      className="input"
                                  >
                                      <option value="true">Active</option>
                                      <option value="false">Inactive</option>
                                  </select>
                              )}
                          />
                      </div>
                      <div className="md:col-span-3">
                        <label className="form-label">Profile Picture</label>
                        <input type="file" accept="image/*" {...register("profilePictureFile")} className="input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        {errors.profilePictureFile && <p className="error-text">{errors.profilePictureFile.message as string}</p>}
                        {isEditMode && employeeToEdit?.employeeInfo?.profilePicture && (
                            <div className="mt-2">
                                <img src={employeeToEdit.employeeInfo.profilePicture} alt="Current profile" className="h-16 w-16 rounded-full object-cover"/>
                            </div>
                        )}
                      </div>
                    </div>
                )}

                {/* Step 2: Personal Details */}
                {currentStep === 2 && (
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                      {renderSectionTitle('Personal Information')}
                      <div>
                          <label className="form-label">Date of Birth</label>
                          <input type="date" {...register("personalInfo.dob")} className="input" />
                      </div>
                      <div>
                          <label className="form-label">Father's Name</label>
                          <input {...register("personalInfo.fathersName")} className="input" />
                      </div>
                      <div>
                          <label className="form-label">Marital Status</label>
                          <select {...register("personalInfo.maritalStatus")} className="input">
                              <option value="">Select Status</option>
                              <option value="Single">Single</option>
                              <option value="Married">Married</option>
                              <option value="Divorced">Divorced</option>
                              <option value="Widowed">Widowed</option>
                          </select>
                      </div>
                      <div>
                          <label className="form-label">Date of Marriage</label>
                          <input type="date" {...register("personalInfo.marriageDate")} className="input" />
                      </div>
                      <div>
                          <label className="form-label">Spouse Name</label>
                          <input {...register("personalInfo.spouseName")} className="input" />
                      </div>
                      <div>
                          <label className="form-label">Nationality</label>
                          <input {...register("personalInfo.nationality")} className="input" />
                      </div>
                      <div>
                          <label className="form-label">Place of Birth</label>
                          <input {...register("personalInfo.placeOfBirth")} className="input" />
                      </div>
                      <div>
                          <label className="form-label">Country of Origin</label>
                          <input {...register("personalInfo.countryOfOrigin")} className="input" />
                      </div>
                       <div>
                          <label className="form-label">Religion</label>
                          <input {...register("personalInfo.religion")} className="input" />
                      </div>
                      <div>
                          <label className="form-label">Personal Email</label>
                          <input type="email" {...register("personalInfo.personalEmail")} className={`input ${errors.personalInfo?.personalEmail ? 'border-red-500' : ''}`} />
                           {errors.personalInfo?.personalEmail && <p className="error-text">{errors.personalInfo.personalEmail.message}</p>}
                      </div>
                       <div>
                          <label className="form-label">Height (e.g., 5'10")</label>
                          <input {...register("personalInfo.height")} className="input" />
                      </div>
                       <div>
                          <label className="form-label">Weight (e.g., 70kg)</label>
                          <input {...register("personalInfo.weight")} className="input" />
                      </div>
                      <div className="md:col-span-3">
                          <label className="form-label">Identification Mark</label>
                          <input {...register("personalInfo.identificationMark")} className="input" />
                      </div>
                      <div>
                          <label className="form-label">Caste</label>
                          <input {...register("personalInfo.caste")} className="input" />
                      </div>
                      <div className="md:col-span-2">
                          <label className="form-label">Hobbies</label>
                          <input {...register("personalInfo.hobby")} className="input" />
                      </div>
                      {/* Checkboxes */}
                      <div className="flex items-center space-x-2 pt-4">
                          <input type="checkbox" {...register("personalInfo.isInternationalEmployee")} id="isInternational" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <label htmlFor="isInternational" className="form-label mb-0 cursor-pointer">International Employee?</label>
                      </div>
                      <div className="flex items-center space-x-2 pt-4">
                          <input type="checkbox" {...register("personalInfo.isPhysicallyChallenged")} id="isChallenged" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <label htmlFor="isChallenged" className="form-label mb-0 cursor-pointer">Physically Challenged?</label>
                      </div>
                       <div className="flex items-center space-x-2 pt-4">
                          <input type="checkbox" {...register("personalInfo.isDirector")} id="isDirector" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <label htmlFor="isDirector" className="form-label mb-0 cursor-pointer">Is a Director?</label>
                      </div>
                   </div>
                )}

                {/* Step 3: Joining & Job Details */}
                {currentStep === 3 && (
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                      {renderSectionTitle('Employment Details')}
                      <div>
                          <label className="form-label">Joining Date</label>
                          <input type="date" {...register("joiningDetails.joiningDate")} className="input" />
                      </div>
                      <div>
                          <label className="form-label">Confirmation Date</label>
                          <input type="date" {...register("joiningDetails.confirmationDate")} className="input" />
                      </div>
                      <div>
                          <label className="form-label">Employment Status</label>
                           <select {...register("joiningDetails.status")} className="input">
                              <option value="">Select Status</option>
                              <option value="Probation">Probation</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Pending">Pending</option>
                          </select>
                      </div>
                      <div>
                          <label className="form-label">Probation Period</label>
                          <input {...register("joiningDetails.probationPeriod")} className="input" placeholder="e.g., 6 Months"/>
                      </div>
                      <div>
                          <label className="form-label">Notice Period</label>
                          <input {...register("joiningDetails.noticePeriod")} className="input" placeholder="e.g., 3 Months"/>
                      </div>
                      <div>
                          <label className="form-label">Referred By</label>
                          <input {...register("joiningDetails.referredBy")} className="input" />
                      </div>
                      {/* Experience Section */}
                      <div className="md:col-span-3 h-px bg-gray-200 my-4"></div>
                      <div>
                          <label className="form-label">Current Co. Experience</label>
                          <input {...register("joiningDetails.currentCompanyExperience")} className="input" placeholder="e.g., 2 Years"/>
                      </div>
                      <div>
                          <label className="form-label">Previous Experience</label>
                          <input {...register("joiningDetails.previousExperience")} className="input" placeholder="e.g., 5 Years"/>
                      </div>
                      <div>
                          <label className="form-label">Total Experience</label>
                          <input {...register("joiningDetails.totalExperience")} className="input" placeholder="e.g., 7 Years"/>
                      </div>
                      {/* Job Details Section */}
                       <div className="md:col-span-3 h-px bg-gray-200 my-4"></div>
                      <div>
                          <label className="form-label">Current Position / Designation</label>
                          <input {...register("jobDetails.currentPosition")} className="input" />
                      </div>
                      <div>
                          <label className="form-label">Department</label>
                          <input {...register("jobDetails.department")} className="input" />
                      </div>
                      <div>
                          <label className="form-label">Reports To (Employee Name/ID)</label>
                          <input {...register("jobDetails.reportsTo")} className="input" />
                      </div>
                   </div>
                )}

                {/* Step 4: Identification & Address */}
                {currentStep === 4 && (
                   <div className="space-y-6">
                      {renderSectionTitle("Identification")}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                         <div>
                              <label className="form-label">Aadhar Card Number</label>
                              <input {...register("identificationDetails.aadharCardNo")} className="input" />
                          </div>
                          <div>
                              <label className="form-label">PAN Card Number</label>
                              <input {...register("identificationDetails.panCardNo")} className="input" />
                          </div>
                      </div>

                      {renderSectionTitle("Present Address")}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                          <div><label className="form-label">Contact Person Name</label><input {...register("addresses.present.name")} className="input" /></div>
                           <div><label className="form-label">Contact Email</label><input type="email" {...register("addresses.present.email")} className={`input ${errors.addresses?.present?.email ? 'border-red-500' : ''}`} /> {errors.addresses?.present?.email && <p className="error-text">{errors.addresses.present.email.message}</p>}</div>
                          <div><label className="form-label">Mobile Number</label><input {...register("addresses.present.mobileNumber")} className="input" /></div>
                          <div className="md:col-span-3">
                              <label className="form-label">Street Address</label>
                              <textarea {...register("addresses.present.address")} className="input" rows={2}></textarea>
                          </div>
                          <div><label className="form-label">City</label><input {...register("addresses.present.city")} className="input" /></div>
                          <div><label className="form-label">State</label><input {...register("addresses.present.state")} className="input" /></div>
                          <div><label className="form-label">Pincode</label><input {...register("addresses.present.pincode")} className="input" /></div>
                          <div><label className="form-label">Country</label><input {...register("addresses.present.country")} className="input" /></div>
                          <div><label className="form-label">Phone Number 1</label><input {...register("addresses.present.phoneNumber1")} className="input" /></div>
                          <div><label className="form-label">Phone Number 2</label><input {...register("addresses.present.phoneNumber2")} className="input" /></div>
                          <div className="md:col-span-3">
                              <label className="form-label">Other Contact Details</label>
                              <input {...register("addresses.present.otherContact")} className="input" />
                          </div>
                      </div>

                       {renderSectionTitle("Permanent Address")}
                       {/* TODO: Add a checkbox 'Same as Present Address' */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                           <div><label className="form-label">Contact Person Name</label><input {...register("addresses.permanent.name")} className="input" /></div>
                           <div><label className="form-label">Contact Email</label><input type="email" {...register("addresses.permanent.email")} className={`input ${errors.addresses?.permanent?.email ? 'border-red-500' : ''}`} /> {errors.addresses?.permanent?.email && <p className="error-text">{errors.addresses.permanent.email.message}</p>}</div>
                          <div><label className="form-label">Mobile Number</label><input {...register("addresses.permanent.mobileNumber")} className="input" /></div>
                          <div className="md:col-span-3">
                              <label className="form-label">Street Address</label>
                              <textarea {...register("addresses.permanent.address")} className="input" rows={2}></textarea>
                          </div>
                          <div><label className="form-label">City</label><input {...register("addresses.permanent.city")} className="input" /></div>
                          <div><label className="form-label">State</label><input {...register("addresses.permanent.state")} className="input" /></div>
                          <div><label className="form-label">Pincode</label><input {...register("addresses.permanent.pincode")} className="input" /></div>
                          <div><label className="form-label">Country</label><input {...register("addresses.permanent.country")} className="input" /></div>
                          <div><label className="form-label">Phone Number 1</label><input {...register("addresses.permanent.phoneNumber1")} className="input" /></div>
                          <div><label className="form-label">Phone Number 2</label><input {...register("addresses.permanent.phoneNumber2")} className="input" /></div>
                           <div className="md:col-span-3">
                              <label className="form-label">Other Contact Details</label>
                              <input {...register("addresses.permanent.otherContact")} className="input" />
                          </div>
                      </div>
                    </div>
                )}

                {/* Step 5: Education & Background */}
                {currentStep === 5 && (
                    <div className="space-y-6">
                      {/* Education Section */}
                      <div className="flex justify-between items-center">
                          {renderSectionTitle("Education Details")}
                          <button type="button" onClick={() => appendEducation({})} className="btn-secondary text-xs flex items-center"><Plus size={14} className="mr-1"/> Add Education</button>
                      </div>
                      {educationFields.map((field, index) => (
                          <div key={field.id} className="grid grid-cols-2 md:grid-cols-6 gap-4 items-end p-4 border rounded-lg relative bg-gray-50/50">
                              <div className="col-span-full text-sm font-semibold text-gray-600 mb-2">Education #{index + 1}</div>
                              <div className="col-span-2"><label className="form-label">Institute Name</label><input {...register(`educationDetails.${index}.instituteName`)} className="input" /></div>
                              <div><label className="form-label">Qualification/Degree</label><input {...register(`educationDetails.${index}.qualification`)} className="input" /></div>
                              <div><label className="form-label">Area/Field of Study</label><input {...register(`educationDetails.${index}.area`)} className="input" /></div>
                              <div><label className="form-label">Grade/Score</label><input {...register(`educationDetails.${index}.grade`)} className="input" /></div>
                               <div><label className="form-label">From Date</label><input type="date" {...register(`educationDetails.${index}.from`)} className="input" /></div>
                                <div className="col-start-1"><label className="form-label">To Date</label><input type="date" {...register(`educationDetails.${index}.to`)} className="input" /></div>

                              <button type="button" onClick={() => removeEducation(index)} className="absolute top-3 right-3 text-red-500 hover:text-red-700" title="Remove Education"><Trash2 size={16}/></button>
                          </div>
                      ))}
                      {errors.educationDetails && <p className="error-text">{errors.educationDetails.message || 'Error in education details'}</p>}


                      {/* Background Check Section */}
                      {renderSectionTitle("Background Check")}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                          <div>
                              <label className="form-label">Verification Status</label>
                              <select {...register("backgroundCheck.verificationStatus")} className="input">
                                 <option value="">Select Status</option>
                                 <option value="Pending">Pending</option>
                                 <option value="Completed">Completed</option>
                                 <option value="Failed">Failed</option>
                              </select>
                          </div>
                          <div>
                              <label className="form-label">Verification Completed On</label>
                              <input type="date" {...register("backgroundCheck.verificationCompletedOn")} className="input" />
                          </div>
                           <div>
                              <label className="form-label">Agency Name</label>
                              <input {...register("backgroundCheck.agencyName")} className="input" />
                          </div>
                           <div className="md:col-span-3">
                              <label className="form-label">Remarks</label>
                              <textarea {...register("backgroundCheck.remarks")} className="input" rows={2}></textarea>
                          </div>
                      </div>
                    </div>
                  )}

            </div>
        </form>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t flex justify-between items-center sticky bottom-0 rounded-b-xl z-10">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={isSubmitting}>Cancel</button>
            <div className="flex items-center space-x-2">
              {currentStep > 1 && <button type="button" onClick={() => setCurrentStep(s => s - 1)} className="btn-secondary" disabled={isSubmitting}>Back</button>}
              {currentStep < formSteps.length && <button type="button" onClick={handleNext} className="btn-primary" disabled={isSubmitting}>Next</button>}
              {currentStep === formSteps.length && <button type="submit" onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? <Loader2 className="animate-spin mr-2" size={16}/> : null}
                  {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Employee' : 'Save Employee')}
              </button>}
            </div>
        </div>
      </div>
    </div>
  );
}