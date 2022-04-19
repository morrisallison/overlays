import { createContext, useContext } from "react";
import type { OverlaysManager } from "./OverlaysManager";

import { OverlaysContextValue } from "./types";

function abstractGetContext(): OverlaysManager {
  throw new Error(
    "No context for overlays is available. Wrap your component tree inside `<OverlayProvider />`"
  );
}

export const OverlaysContext =
  createContext<OverlaysContextValue>(abstractGetContext);

export function useOverlaysContext() {
  return useContext(OverlaysContext)();
}
