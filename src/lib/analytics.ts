/**
 * SEM & Web Analytics Utility for VTU Updates
 * Supports Google Analytics 4 (GA4), Google Tag Manager (GTM),
 * and Google Ads Conversion Tracking.
 *
 * Privacy Note: Does not track personal information (phone numbers, full names).
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Dispatches custom events to Google Analytics 4.
 * Fails gracefully and silently if GA is not configured.
 */
export function trackEvent(
  eventName: string,
  eventParams: Record<string, unknown> = {}
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  try {
    window.gtag("event", eventName, eventParams);
  } catch {
    // Fail silently in production
  }
}

/**
 * Tracks outbound external link clicks (e.g. VTU results, circulars, internships).
 */
export function trackExternalClick(url: string, label: string): void {
  trackEvent("click_external_resource", {
    link_url: url,
    link_text: label,
  });
}

/**
 * Tracks student registration form submission without logging PII.
 */
export function trackRegistrationSubmit(data: { college?: string }): void {
  trackEvent("student_registration_submit", {
    college_selected: data.college || "Unspecified",
    event_category: "Engagement",
  });
}

/**
 * Tracks student interactions with study materials / notes navigation.
 */
export function trackNotesAccess(params: {
  year: string;
  scheme: string;
  branch?: string;
  semester?: string;
  subjectCode?: string;
}): void {
  trackEvent("view_study_materials", {
    engineering_year: params.year,
    scheme: params.scheme,
    branch: params.branch || "All",
    semester: params.semester || "All",
    subject_code: params.subjectCode || "N/A",
  });
}

/**
 * Hook for Google Ads Conversion Tracking.
 * When a Google Ads Conversion ID / Label is configured,
 * it will fire the conversion event to Google Ads.
 */
export function trackConversion(conversionLabel?: string): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  try {
    const defaultConversionId =
      process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID || "";
    const sendTo = conversionLabel || defaultConversionId;

    if (sendTo) {
      window.gtag("event", "conversion", {
        send_to: sendTo,
      });
    }

    // Also send standard GA4 conversion lead event
    window.gtag("event", "generate_lead", {
      value: 1,
      currency: "INR",
    });
  } catch {
    // Fail silently
  }
}
