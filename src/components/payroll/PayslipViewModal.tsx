// src/components/payroll/PayslipViewModal.tsx
"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../lib/redux/store";
import {
  fetchMyPayslipById,
  clearSelectedPayslip as clearEmployeeSelected,
} from "../../lib/redux/slices/employeePayslipSlice";
import {
  fetchPayslipById as fetchAdminPayslipById,
  clearSelectedAdminPayslip,
} from "../../lib/redux/slices/adminPayrollSlice";
import { Payslip } from "../../types";
import { Loader2, X, Download } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api"

interface Props {
  isOpen: boolean;
  onClose: () => void;
  payslipId: string | null;
  isAdmin: boolean; // Differentiates which slice/API to use
}

// Helper to format currency
const formatCurrency = (amount: number) => {
  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
// Helper to format month/year
const formatMonthYear = (month: number, year: number) => {
  return new Date(year, month - 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

export default function PayslipViewModal({
  isOpen,
  onClose,
  payslipId,
  isAdmin,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { payslip, loading, error } = useSelector((state: RootState) =>
    isAdmin
      ? {
          payslip: state.adminPayroll.selectedPayslip,
          loading: state.adminPayroll.loadingDetail,
          error: state.adminPayroll.error,
        }
      : {
          payslip: state.employeePayslips.selectedPayslip,
          loading: state.employeePayslips.loadingDetail,
          error: state.employeePayslips.error,
        }
  );

  useEffect(() => {
    if (isOpen && payslipId) {
      if (isAdmin) {
        dispatch(fetchAdminPayslipById(payslipId));
      } else {
        dispatch(fetchMyPayslipById(payslipId));
      }
    }
    // Cleanup on close
    return () => {
      if (!isOpen) {
        if (isAdmin) dispatch(clearSelectedAdminPayslip());
        else dispatch(clearEmployeeSelected());
      }
    };
  }, [isOpen, payslipId, isAdmin, dispatch]);

  // Placeholder download function
  // const handleDownload = () => {
  //   if (!payslip) return;
  //   toast.success(
  //     `Download functionality for ${formatMonthYear(
  //       payslip.month,
  //       payslip.year
  //     )} not implemented yet.`
  //   );
  //   // Needs backend endpoint or frontend PDF library (e.g., jsPDF, react-pdf)
  // };
const handleDownload = () => {
  if (!payslip || !payslipId) return;

  // Construct the correct download URL based on user type
  const downloadUrl = `${api.defaults.baseURL}${isAdmin ? '/admin' : '/employee'}/payslips/${payslipId}/download`;

  // Open the URL in a new tab/window - the backend headers will trigger download
  window.open(downloadUrl, '_blank');
 };




  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col my-auto">
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-800">
            Payslip Details{" "}
            {payslip ? `- ${formatMonthYear(payslip.month, payslip.year)}` : ""}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
          )}
          {error && (
            <p className="text-red-500 text-sm text-center py-4">{error}</p>
          )}
          {payslip && !loading && !error && (
            <div className="space-y-6 text-sm">
              {/* Header Info */}
              <div className="text-center mb-6">
                {/* Add Company Name/Logo Here */}
                <h3 className="font-bold text-xl text-gray-800">Soul Skool</h3>
                <p className="text-xs text-gray-500">Company Address</p>
                <p className="font-semibold mt-2">
                  Payslip for {formatMonthYear(payslip.month, payslip.year)}
                </p>
              </div>

              {/* Employee Details Grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 border p-3 rounded-md bg-gray-50/50">
                <DetailItem
                  label="Employee Name"
                  value={payslip.employeeSnapshot.name}
                />
                <DetailItem
                  label="Employee ID"
                  value={payslip.employeeSnapshot.employeeId}
                />
                <DetailItem
                  label="Designation"
                  value={payslip.employeeSnapshot.designation || "-"}
                />
                <DetailItem
                  label="Department"
                  value={payslip.employeeSnapshot.department || "-"}
                />
                <DetailItem
                  label="PAN"
                  value={payslip.employeeSnapshot.panNumber || "-"}
                />
                <DetailItem
                  label="Bank Account"
                  value={
                    payslip.employeeSnapshot.bankDetails?.accountNumber || "-"
                  }
                />
                {/* Add Joining Date, PF No etc. if available in snapshot */}
              </div>

              {/* Earnings and Deductions Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Earnings */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 border-b pb-1">
                    Earnings
                  </h4>
                  <div className="space-y-1">
                    <AmountItem label="Basic" amount={payslip.earnings.basic} />
                    <AmountItem label="HRA" amount={payslip.earnings.hra} />
                    <AmountItem
                      label="Medical Allowance"
                      amount={payslip.earnings.medicalAllowance}
                    />
                    <AmountItem
                      label="Special Allowance"
                      amount={payslip.earnings.specialAllowance}
                    />
                    <div className="h-px bg-gray-200 my-1"></div>
                    <AmountItem
                      label="Total Earnings"
                      amount={payslip.earnings.total}
                      isTotal={true}
                    />
                  </div>
                </div>
                {/* Deductions */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 border-b pb-1">
                    Deductions
                  </h4>
                  <div className="space-y-1">
                    <AmountItem
                      label="Professional Tax"
                      amount={payslip.deductions.professionalTax}
                    />
                    {/* Add other deductions here */}
                    <div className="h-px bg-gray-200 my-1"></div>
                    <AmountItem
                      label="Total Deductions"
                      amount={payslip.deductions.total}
                      isTotal={true}
                    />
                  </div>
                </div>
              </div>

              {/* Net Pay */}
              <div className="mt-4 pt-4 border-t text-center">
                <p className="text-gray-600 font-medium">Net Pay</p>
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(payslip.netPay)}
                </p>
                {/* Add Net Pay in words if needed */}
              </div>

              {/* Footer Info */}
              <div className="text-xs text-gray-400 text-center mt-6">
                Generated on:{" "}
                {new Date(payslip.generatedAt).toLocaleString("en-IN")} |
                {payslip.isReleased && payslip.releasedAt
                  ? ` Released on: ${new Date(
                      payslip.releasedAt
                    ).toLocaleString("en-IN")}`
                  : " Not Released"}
                <br /> System Generated Payslip.
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t flex justify-end space-x-2 sticky bottom-0 rounded-b-lg">
          <button type="button" onClick={onClose} className="btn-secondary">
            Close
          </button>
          {payslip && (
            <button
              onClick={handleDownload}
              className="btn-primary bg-green-600 hover:bg-green-700 focus:ring-green-500 flex items-center space-x-1"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper components for display items
const DetailItem: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);
const AmountItem: React.FC<{
  label: string;
  amount: number;
  isTotal?: boolean;
}> = ({ label, amount, isTotal = false }) => (
  <div
    className={`flex justify-between ${
      isTotal ? "font-bold text-gray-800" : "text-gray-700"
    }`}
  >
    <span>{label}</span>
    <span>{formatCurrency(amount)}</span>
  </div>
);
