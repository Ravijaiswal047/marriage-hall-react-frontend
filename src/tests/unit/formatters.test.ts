import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatSlotLabel } from '@/lib/utils/formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('formats null or undefined as ₹0', () => {
      expect(formatCurrency(null)).toBe('₹0');
      expect(formatCurrency(undefined)).toBe('₹0');
      expect(formatCurrency(NaN)).toBe('₹0');
    });

    it('formats numbers to INR currency format', () => {
      const formatted = formatCurrency(50000);
      expect(formatted).toContain('50,000');
    });
  });

  describe('formatDate', () => {
    it('returns N/A for empty input', () => {
      expect(formatDate(null)).toBe('N/A');
      expect(formatDate(undefined)).toBe('N/A');
      expect(formatDate('')).toBe('N/A');
    });

    it('formats ISO date strings correctly', () => {
      const result = formatDate('2026-10-15T00:00:00.000Z');
      expect(result).toBe('15 Oct 2026');
    });

    it('returns original input on invalid date parse', () => {
      expect(formatDate('invalid-date')).toBe('invalid-date');
    });
  });

  describe('formatSlotLabel', () => {
    it('returns standard label for MORNING', () => {
      expect(formatSlotLabel('MORNING')).toBe('Morning Slot (8 AM - 3 PM)');
    });

    it('returns standard label for EVENING', () => {
      expect(formatSlotLabel('EVENING')).toBe('Evening Slot (5 PM - 11 PM)');
    });

    it('returns standard label for FULL_DAY', () => {
      expect(formatSlotLabel('FULL_DAY')).toBe('Full Day (24 Hours)');
    });

    it('falls back to input string or default', () => {
      expect(formatSlotLabel('CUSTOM')).toBe('CUSTOM');
      expect(formatSlotLabel(undefined)).toBe('Full Day');
    });
  });
});

