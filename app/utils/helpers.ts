/**
 * Calculate average of an array of numbers
 */
export const average = (arr: number[]): number => {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
};

/**
 * Format number as Nigerian Naira currency
 */
export const formatNaira = (amount: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
};

/**
 * Generate WhatsApp link with pre-filled message
 */
export const generateWhatsAppLink = (phone: string, message: string): string => {
  const cleanPhone = String(phone || "").replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(String(message || ""));
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

/**
 * Generate unique ID (fallback for crypto.randomUUID)
 */
export const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
};

/**
 * Get current timestamp in ISO format
 */
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Unknown date";
  }
};

/**
 * Extract short university name (remove part in parentheses)
 */
export const getShortUniversityName = (fullName: string): string => {
  return String(fullName || "").split(" (")[0];
};