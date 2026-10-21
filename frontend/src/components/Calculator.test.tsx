import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Calculator } from './Calculator';
import '@testing-library/jest-dom';

vi.mock('../api/calculator', () => ({
  calculate: vi.fn(),
}));

describe('Calculator Component', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display the initial value 0 on the screen', () => {
    const { container } = render(<Calculator />);
    
    const displayValue = container.querySelector('.display-value');
    expect(displayValue?.textContent).toBe('0');
  });

  it('should concatenate numbers correctly when clicked', () => {
    const { container } = render(<Calculator />);
    
    // Simulate clicks on buttons 7 and 5
    fireEvent.click(screen.getByText('7'));
    fireEvent.click(screen.getByText('5'));

    // Verify that the display shows "75"
    const displayValue = container.querySelector('.display-value');
    expect(displayValue?.textContent).toBe('75');
  });

  it('should clear the screen when the AC button is pressed', () => {
    const { container } = render(<Calculator />);
    
    // Enter a number and then clear it
    fireEvent.click(screen.getByText('9'));
    fireEvent.click(screen.getByText('AC'));

    // Verify that the display reverted to "0"
    const displayValue = container.querySelector('.display-value');
    expect(displayValue?.textContent).toBe('0');
  });
});