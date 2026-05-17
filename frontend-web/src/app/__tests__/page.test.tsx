import { render } from '@testing-library/react';

import HomePage from '../page';

async function setup() {
  render(<HomePage />);
}

describe('DashboardPage', () => {
  it('DELETE ME: just a sample test setup', async () => {
    await setup();

    expect(true).toBe(true);
  });
});
