import { render } from '@testing-library/react-native';

import HomeScreen from '@/app/index';

describe('<HomeScreen />', () => {
  test('just a placeholder test', () => {
    render(<HomeScreen />);

    expect(true).toBe(true);
  });
});
