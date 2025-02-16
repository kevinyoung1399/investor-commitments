import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

vi.mock('./environment', () => ({
  environment: {
    apiUrl: 'http://test.com',
  },
}));

afterEach(() => {
  cleanup();
});
