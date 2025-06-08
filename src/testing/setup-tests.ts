import '@testing-library/jest-dom/vitest';
import { vi, expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

vi.mock('zustand');

expect.extend(matchers)

afterEach(() => {
  cleanup();
});