/**
 * Formats a date string (YYYY-MM-DD format) to local date string
 * Expects plain date strings without timezone information
 */
export const formatLocalDate = (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
  // Handle both YYYY-MM-DD and ISO format (for backwards compatibility)
  const datePart = dateString.includes('T') ? dateString.split('T')[0] : dateString;
  const [year, month, day] = datePart.split('-').map(Number);
  
  // Create date in local timezone
  const date = new Date(year, month - 1, day);
  
  return date.toLocaleDateString(undefined, options);
};

/**
 * Gets today's date as YYYY-MM-DD string
 */
export const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

