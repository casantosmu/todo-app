import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render as renderLib } from "@testing-library/react";
import type { ReactNode } from "react";
import Modal from "react-modal";
import "../src/lib/i18n";

export default function render(children?: ReactNode) {
  const queryClient = new QueryClient();

  const view = renderLib(
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  Modal.setAppElement(view.container);

  return view;
}
