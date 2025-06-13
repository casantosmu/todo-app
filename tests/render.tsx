import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render as renderLib } from "@testing-library/react";
import type { ReactNode } from "react";
import "../src/lib/i18n";

export default function render(children?: ReactNode) {
  const queryClient = new QueryClient();

  return renderLib(
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
