// These next 2 imports are for removing default behaviors of react-testing-library of showing HTML in failed tests
import { configure as domConfigure } from '@testing-library/dom';
import '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup, configure as reactConfigure } from '@testing-library/react';
import { afterEach, expect } from 'vitest';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

// Remove HTML from error messages to make them cleaner
const testingLibraryConfig = {
  getElementError: (message: string | null) => {
    const error = new Error(message ?? 'Query failed');
    error.name = 'TestingLibraryElementError';
    return error;
  },
};

domConfigure(testingLibraryConfig);
reactConfigure(testingLibraryConfig);
