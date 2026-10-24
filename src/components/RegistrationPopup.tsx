"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import RegistrationModal, { StudentData } from "@/app/student-hub/RegistrationModal";
import { APP_CONFIG } from "@/config/app-config";

export default function RegistrationPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(true); // default true to prevent SSR flash
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleNextPopup = useCallback((delayMs = 5000) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const registered = localStorage.getItem("vtu_registered") === "true";
      if (!registered) {
        setIsOpen(true);
      }
    }, delayMs);
  }, []);

  useEffect(() => {
    // Check client storage on mount
    const registered = localStorage.getItem("vtu_registered") === "true";
    setIsRegistered(registered);

    if (!registered) {
      // First appearance: 5 seconds after visiting the website
      scheduleNextPopup(5000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [scheduleNextPopup]);

  const handleClose = () => {
    setIsOpen(false);
    // User closed without filling details: popup returns in 5 seconds
    const registered = localStorage.getItem("vtu_registered") === "true";
    if (!registered) {
      scheduleNextPopup(5000);
    }
  };

  const handleSuccess = (data: StudentData) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRegistered(true);
    setIsOpen(false);
  };

  if (isRegistered || !isOpen) return null;

  return (
    <RegistrationModal
      appsScriptUrl={APP_CONFIG.APPS_SCRIPT_URL}
      onClose={handleClose}
      onSuccess={handleSuccess}
    />
  );
}
