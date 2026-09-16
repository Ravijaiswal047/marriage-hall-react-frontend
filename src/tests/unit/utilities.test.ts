import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils/cn';

describe('cn utility', () => {
  it('merges class names correctly', () => {
    const isHidden = false;
    const result = cn('px-2 py-1', 'bg-blue-500', isHidden && 'hidden');
    expect(result).toContain('px-2');
    expect(result).toContain('py-1');
    expect(result).toContain('bg-blue-500');
    expect(result).not.toContain('hidden');
  });

  it('combines class names cleanly', () => {
    const result = cn('p-4', 'p-2');
    expect(result).toBe('p-4 p-2');
  });
});

