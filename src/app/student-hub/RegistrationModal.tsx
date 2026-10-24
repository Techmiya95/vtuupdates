"use client";

import { useState, useCallback } from "react";
import { SORTED_VTU_COLLEGES } from "@/data/vtu-colleges";

export interface StudentData {
  name: string;
  phone: string;
  email: string;
  college: string;
}

interface RegistrationModalProps {
  onSuccess: (data: StudentData) => void;
  onClose: () => void;
  appsScriptUrl?: string;
}

const APPS_SCRIPT_PLACEHOLDER = "YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";

export default function RegistrationModal({
  onSuccess,
  onClose,
  appsScriptUrl = APPS_SCRIPT_PLACEHOLDER,
}: RegistrationModalProps) {
  const [form, setForm] = useState<StudentData>({
    name: "",
    phone: "",
    email: "",
    college: "",
  });
  const [errors, setErrors] = useState<Partial<StudentData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Partial<StudentData> = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = "Full name is required (min 2 characters)";
    }
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!form.college) {
      newErrors.college = "Please select your college";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = useCallback(async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Submit to Google Apps Script (no-cors because Apps Script doesn't set CORS headers)
      if (appsScriptUrl !== APPS_SCRIPT_PLACEHOLDER) {
        const body = new FormData();
        body.append("name", form.name.trim());
        body.append("phone", form.phone.trim());
        body.append("email", form.email.trim());
        body.append("college", form.college);
        body.append("timestamp", new Date().toISOString());

        await fetch(appsScriptUrl, { method: "POST", body, mode: "no-cors" });
      }

      // Save locally so the popup doesn't appear again this session
      localStorage.setItem("vtu_registered", "true");
      localStorage.setItem("vtu_user", JSON.stringify(form));

      onSuccess(form);
    } catch {
      // no-cors responses always throw but the sheet still gets the data
      localStorage.setItem("vtu_registered", "true");
      localStorage.setItem("vtu_user", JSON.stringify(form));
      onSuccess(form);
    } finally {
      setSubmitting(false);
    }
  }, [form, appsScriptUrl, onSuccess]);

  const field = (
    id: keyof StudentData,
    label: string,
    placeholder: string,
    type = "text",
  ) => (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-600 mb-1.5">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        id={id}
        type={type}
        value={form[id]}
        onChange={(e) => {
          setForm((prev) => ({ ...prev, [id]: e.target.value }));
          if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }));
        }}
        placeholder={placeholder}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
          errors[id]
            ? "border-red-400 bg-red-50 focus:ring-red-100"
            : "border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-100"
        }`}
      />
      {errors[id] && (
        <p className="mt-1 text-xs text-red-600">{errors[id]}</p>
      )}
    </div>
  );

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#102c59] to-[#1a3d7a] px-6 py-5 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/60 hover:text-white transition text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-lg">
              🎓
            </span>
            <div>
              <h2 className="text-lg font-bold">Access Study Materials</h2>
              <p className="text-xs text-blue-200 mt-0.5">
                Fill in your details to unlock notes & resources
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          {field("name", "Full Name", "e.g. Mohammed Ibrahim")}
          {field("phone", "Mobile Number", "10-digit mobile number", "tel")}
          {field("email", "Email Address", "you@example.com", "email")}

          {/* College dropdown */}
          <div>
            <label htmlFor="college" className="block text-xs font-semibold text-slate-600 mb-1.5">
              College <span className="text-red-500">*</span>
            </label>
            <select
              id="college"
              value={form.college}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, college: e.target.value }));
                if (errors.college) setErrors((prev) => ({ ...prev, college: undefined }));
              }}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                errors.college
                  ? "border-red-400 bg-red-50 focus:ring-red-100"
                  : "border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-100"
              }`}
            >
              <option value="">Select your VTU-affiliated college</option>
              {SORTED_VTU_COLLEGES.map((college) => (
                <option key={college} value={college}>
                  {college}
                </option>
              ))}
            </select>
            {errors.college && (
              <p className="mt-1 text-xs text-red-600">{errors.college}</p>
            )}
          </div>

          {submitError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {submitError}
            </p>
          )}

          <p className="text-xs text-slate-400 leading-5">
            Your information is only used to personalise your experience and
            is never shared with third parties.
          </p>

          <button
            onClick={submit}
            disabled={submitting}
            className="w-full rounded-xl bg-[#102c59] py-3.5 text-sm font-bold text-white transition hover:bg-[#1a3d7a] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Submitting…
              </span>
            ) : (
              "Get Access to Notes →"
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-6 py-3 text-center">
          <p className="text-xs text-slate-400">
            🔒 Secure · For VTU students only · Free access
          </p>
        </div>
      </div>
    </div>
  );
}
