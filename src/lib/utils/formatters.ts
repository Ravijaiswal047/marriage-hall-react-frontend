import { format, parseISO } from 'date-fns';

export function formatCurrency(amount?: number | null): string {
  if (amount == null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'dd MMM yyyy');
  } catch {
    return dateString;
  }
}

export function formatSlotLabel(slot?: string): string {
  switch (slot) {
    case 'MORNING':
      return 'Morning Slot (8 AM - 3 PM)';
    case 'EVENING':
      return 'Evening Slot (5 PM - 11 PM)';
    case 'FULL_DAY':
      return 'Full Day (24 Hours)';
    default:
      return slot || 'Full Day';
  }
}

