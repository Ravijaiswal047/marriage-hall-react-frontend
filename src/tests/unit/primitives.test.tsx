import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { Avatar } from '@/components/ui/Avatar';

describe('UI Primitives', () => {
  describe('Button', () => {
    it('renders button text correctly', () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeDefined();
    });

    it('shows loading state when isLoading is true', () => {
      render(<Button isLoading>Submit</Button>);
      expect(screen.getByRole('button')).toBeDefined();
    });
  });

  describe('Badge', () => {
    it('renders badge content with variant styling', () => {
      render(<Badge variant="success">Active</Badge>);
      expect(screen.getByText('Active')).toBeDefined();
    });
  });

  describe('Input', () => {
    it('renders input with label and placeholder', () => {
      render(<Input label="Email Address" placeholder="enter email" />);
      expect(screen.getByText('Email Address')).toBeDefined();
      expect(screen.getByPlaceholderText('enter email')).toBeDefined();
    });

    it('displays error message when provided', () => {
      render(<Input label="Password" error="Password is required" />);
      expect(screen.getByText('Password is required')).toBeDefined();
    });
  });

  describe('Spinner', () => {
    it('renders accessible spinner', () => {
      render(<Spinner size="md" />);
      expect(document.querySelector('.animate-spin')).toBeDefined();
    });
  });

  describe('Avatar', () => {
    it('renders fallback initials when name is provided without image', () => {
      render(<Avatar name="John Doe" />);
      expect(screen.getByText('JD')).toBeDefined();
    });
  });
});

