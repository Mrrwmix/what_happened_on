import { HttpResponse, http } from "msw";

import type { SetupServer } from "msw/node";
import { vi } from "vitest";

declare global {
  interface Window {
    msw: {
      worker: SetupServer;
    };
  }
  // eslint-disable-next-line no-var
  var msw: {
    worker: SetupServer;
  };
}

export { vi, http, HttpResponse };
