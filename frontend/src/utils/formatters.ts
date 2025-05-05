// Format currency - default INR
export const formatCurrency = (amount: number, currency = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date - default Indian style (DD/MM/YYYY)
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN');
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Format phone number (Indian format)
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a valid Indian number (10 digits)
  if (cleaned.length !== 10) return phone;
  
  // Format as +91 XXXXX XXXXX
  return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
};

// Format GST number
export const formatGSTIN = (gstin: string): string => {
  if (!gstin) return '';
  
  // Remove any non-alphanumeric characters
  const cleaned = gstin.replace(/[^a-zA-Z0-9]/g, '');
  
  // GSTIN is typically 15 characters
  if (cleaned.length !== 15) return gstin;
  
  // Format as 22AAAAA0000A1Z5
  return cleaned.toUpperCase();
};