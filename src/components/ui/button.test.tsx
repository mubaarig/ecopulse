import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from './button';

describe('Button', () => {
  it('renders with default variant and size', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('h-10');
  });

  it('applies variant and size specific styles', () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>,
    );

    const button = screen.getByRole('button', { name: /delete/i });

    expect(button).toHaveClass('bg-destructive');
    expect(button).toHaveClass('px-8');
  });
});
