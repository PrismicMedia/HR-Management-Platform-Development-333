import { render } from '@testing-library/react';
import SafeIcon from '../SafeIcon';
import { FiAlertTriangle } from 'react-icons/fi';

test('renders fallback icon for unknown name', () => {
  const { container } = render(<SafeIcon name="Unknown" data-testid="icon" />);
  const { container: fallback } = render(<FiAlertTriangle data-testid="icon" />);
  expect(container.innerHTML).toBe(fallback.innerHTML);
});
