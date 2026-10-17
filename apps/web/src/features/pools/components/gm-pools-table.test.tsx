import { afterEach, describe, expect, it } from 'vitest';

import { cleanup, render, screen } from '@testing-library/react';
import { GmPoolsTable } from './gm-pools-table';
import type { Pool } from './gm-pools-table';

afterEach(() => {
  cleanup();
});

describe('GmPoolsTable', () => {
  it('renders loading state', () => {
    const { container } = render(<GmPoolsTable isLoading />);
    expect(container.querySelector('[data-slot="data-table-loading"]')).toBeTruthy();
  });

  it('renders empty state', () => {
    const { container } = render(<GmPoolsTable pools={[]} />);
    expect(container.querySelector('[data-slot="empty-state"]')).toBeTruthy();
    expect(screen.getByText('No pools found')).toBeTruthy();
  });

  it('renders fixture row and visible columns', () => {
    const fixture: Array<Pool> = [
      { id: '1', name: 'USDC/XLM', tvl: '$1,000,000', apr: '12%' },
    ];
    render(<GmPoolsTable pools={fixture} />);

    expect(screen.getByRole('columnheader', { name: 'Pool' })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'TVL' })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'APR' })).toBeTruthy();

    expect(screen.getByRole('cell', { name: 'USDC/XLM' })).toBeTruthy();
    expect(screen.getByText('$1.0M')).toBeTruthy();
    expect(screen.getByText('+12.00%')).toBeTruthy();
  });
});
