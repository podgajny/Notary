// Test setup file dla Vitest
import { expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

// Rozszerz expect o matcher z testing-library
expect.extend(matchers);
