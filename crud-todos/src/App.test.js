// App.test.js
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: { todos: [] } })),
  post: jest.fn(() => Promise.resolve()),
  put: jest.fn(() => Promise.resolve()),
  delete: jest.fn(() => Promise.resolve()),
}));

import { render, screen } from '@testing-library/react';
import TodosList from './components/TodosList';

test('renders input and add button', () => {
  render(<TodosList />);

  const input = screen.getByPlaceholderText(/add a new todo/i);
  const button = screen.getByRole('button', { name: /add todo/i });

  expect(input).toBeInTheDocument();
  expect(button).toBeInTheDocument();
});
