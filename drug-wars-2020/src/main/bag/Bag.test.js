import React from 'react';
import { render } from '@testing-library/react';
import Bag from './Bag';

test('renders learn react link', () => {
  const { getByText } = render(<Bag />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
