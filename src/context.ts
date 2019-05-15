import { createContext } from "react";

import { ContentValue, RootValue } from "./types";

function abstractGetContext(): any {
  throw new Error(
    "No context for overlays is available. Wrap your component tree inside `<OverlayProvider />`"
  );
}

export const ContentContext = createContext<ContentValue>(
  abstractGetContext as ContentValue
);
export const RootContext = createContext<RootValue>(
  abstractGetContext as RootValue
);
