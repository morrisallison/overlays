import React, { ReactNode, useCallback, useMemo } from "react";

import { OverlaysContext } from "./context";
import { OverlaysManager } from "./OverlaysManager";

export function OverlayProvider(props: { children: ReactNode }) {
  const manager = useMemo(() => new OverlaysManager(), []);
  const value = useCallback(() => manager, [manager]);

  return (
    <OverlaysContext.Provider value={value}>
      {props.children}
    </OverlaysContext.Provider>
  );
}
